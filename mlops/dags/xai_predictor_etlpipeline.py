from airflow import DAG
from airflow.decorators import task
from airflow.providers.postgres.hooks.postgres import PostgresHook
import pendulum
import pandas as pd
import numpy as np
from pathlib import Path
import subprocess
import zipfile
import shutil

# ============================================================
# CONFIGURATION
# ============================================================
# Use /opt/airflow/data which typically has write permissions in Airflow Docker
# Alternative: Use /tmp/oulad if /opt/airflow/data doesn't work
# DATA_DIR = Path("/opt/airflow/data/oulad")
DATA_DIR = Path("/tmp/data/oulad")

## Define the DAG
with DAG(
    dag_id='oulad_academic_risk_etl',
    start_date=pendulum.today().subtract(days=2),
    schedule='@daily',
    catchup=False,
    tags=['mlops', 'etl', 'oulad']
) as dag:
    
    ## Step 1: Create the table safely
    @task
    def create_table():
        postgres_hook = PostgresHook(postgres_conn_id="neondb_remote_host")

        # Define the expected schema
        expected_schema = """
        id SERIAL PRIMARY KEY,
        id_student BIGINT,
        code_module VARCHAR(20),
        code_presentation VARCHAR(20),
        gender VARCHAR(10),
        region VARCHAR(100),
        highest_education VARCHAR(100),
        age_band VARCHAR(20),
        final_result VARCHAR(20),
        avg_grade FLOAT,
        grade_consistency FLOAT,
        grade_range FLOAT,
        num_assessments INTEGER,
        assessment_completion_rate FLOAT,
        studied_credits INTEGER,
        num_of_prev_attempts INTEGER,
        low_performance INTEGER,
        low_engagement INTEGER,
        has_previous_attempts INTEGER,
        is_at_risk INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        """
        
        # Check if table exists and if schema matches
        check_table_query = """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'oulad_student_risk'
        );
        """
        
        table_exists = postgres_hook.get_first(check_table_query)[0]
        
        if table_exists:
            # Check if schema matches by comparing column types
            check_schema_query = """
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'oulad_student_risk'
            ORDER BY ordinal_position;
            """
            
            current_schema = postgres_hook.get_records(check_schema_query)
            
            # Define expected schema for comparison
            expected_columns = {
                'id': ('integer', None),
                'id_student': ('bigint', None),
                'code_module': ('character varying', 20),
                'code_presentation': ('character varying', 20),
                'gender': ('character varying', 10),
                'region': ('character varying', 100),
                'highest_education': ('character varying', 100),
                'age_band': ('character varying', 20),
                'final_result': ('character varying', 20),
                'avg_grade': ('double precision', None),
                'grade_consistency': ('double precision', None),
                'grade_range': ('double precision', None),
                'num_assessments': ('integer', None),
                'assessment_completion_rate': ('double precision', None),
                'studied_credits': ('integer', None),
                'num_of_prev_attempts': ('integer', None),
                'low_performance': ('integer', None),
                'low_engagement': ('integer', None),
                'has_previous_attempts': ('integer', None),
                'is_at_risk': ('integer', None),
                'created_at': ('timestamp without time zone', None)
            }
            
            # Check for schema mismatch
            schema_changed = False
            for col_name, col_type, col_length in current_schema:
                if col_name in expected_columns:
                    expected_type, expected_length = expected_columns[col_name]
                    if col_type != expected_type or col_length != expected_length:
                        schema_changed = True
                        print(f"Schema mismatch on column '{col_name}': {col_type}({col_length}) != {expected_type}({expected_length})")
                        break
            
            if schema_changed:
                print("Schema changed detected. Dropping and recreating table...")
                drop_and_create_query = f"""
                DROP TABLE IF EXISTS oulad_student_risk CASCADE;
                CREATE TABLE oulad_student_risk ({expected_schema});
                """
                postgres_hook.run(drop_and_create_query)
                print("Table recreated due to schema change")
            else:
                print("Table exists with correct schema. Ready for upsert operations.")
        else:
            # Create table if it doesn't exist
            create_table_query = f"""
            CREATE TABLE oulad_student_risk ({expected_schema});
            """
            postgres_hook.run(create_table_query)
            print("Table created successfully")

    ## Step 1.5: Download OULAD dataset from Kaggle using kagglehub
    @task
    def download_kaggle_dataset():
        """
        Downloads OULAD dataset from Kaggle using kagglehub and saves CSVs to DATA_DIR.
        Requires KAGGLE_API_TOKEN environment variable to be configured in docker-compose.
        """
        import kagglehub
        from kagglehub import KaggleDatasetAdapter
        
        # Ensure DATA_DIR exists
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        
        # Check if data already exists
        required_files = ["studentInfo.csv", "studentAssessment.csv", "assessments.csv"]
        if all((DATA_DIR / file).exists() for file in required_files):
            print(f"Data already exists in {DATA_DIR}. Skipping download.")
            return
        
        print(f"Downloading OULAD dataset from Kaggle using kagglehub...")
        
        dataset_name = "anlgrbz/student-demographics-online-education-dataoulad"
        
        try:
            # Download each required file
            for file_name in required_files:
                print(f"Loading {file_name}...")
                
                # Load the dataset using kagglehub
                df = kagglehub.load_dataset(
                    KaggleDatasetAdapter.PANDAS,
                    dataset_name,
                    file_name
                )
                
                # Save to DATA_DIR
                output_path = DATA_DIR / file_name
                df.to_csv(output_path, index=False)
                print(f"Saved {file_name} to {output_path} ({len(df)} records)")
            
            # Verify all required files exist
            missing_files = [f for f in required_files if not (DATA_DIR / f).exists()]
            if missing_files:
                raise FileNotFoundError(f"Missing required files after download: {missing_files}")
            
            print(f"All required CSV files are present in {DATA_DIR}")
            
        except Exception as e:
            error_msg = f"Failed to download dataset from Kaggle: {str(e)}"
            print(error_msg)
            raise RuntimeError(
                f"{error_msg}\n"
                "Please ensure:\n"
                "1. kagglehub is installed: pip install kagglehub[pandas-datasets]\n"
                "2. KAGGLE_API_TOKEN environment variable is configured in docker-compose.yml\n"
                "3. You have accepted the dataset terms on Kaggle website"
            )

    ## Step 2: Extract data with Path validation
    @task
    def extract_oulad_data():
        if not DATA_DIR.exists():
            raise FileNotFoundError(f"Data directory not found at {DATA_DIR}. Check your Docker volume mounts!")
            
        print(f"Loading OULAD datasets from {DATA_DIR}...")
        
        student_info = pd.read_csv(DATA_DIR / "studentInfo.csv")
        student_assessment = pd.read_csv(DATA_DIR / "studentAssessment.csv")
        assessments = pd.read_csv(DATA_DIR / "assessments.csv")
        
        # Save to temp pickle file instead of returning dict
        temp_file = DATA_DIR / "extracted_data.pkl"
        data = {
            'student_info': student_info,
            'student_assessment': student_assessment,
            'assessments': assessments
        }
        pd.to_pickle(data, temp_file)
        
        print(f"Extracted data saved to {temp_file}")
        return str(temp_file)  # Return only the file path

    ## Step 3: Transform
    @task
    def preprocess_oulad_data(temp_file_path):
        # Load from pickle file
        data_dict = pd.read_pickle(temp_file_path)
        student_info = data_dict['student_info']
        student_assessment = data_dict['student_assessment']
        assessments = data_dict['assessments']
        
        assessment_data = student_assessment.merge(
            student_info[["id_student", "code_module", "code_presentation"]],
            on="id_student", how="left"
        ).merge(
            assessments[["id_assessment", "assessment_type", "weight"]],
            on="id_assessment", how="left"
        )
        
        student_metrics = (
            assessment_data.groupby(["id_student", "code_module", "code_presentation"])
            .agg({"score": ["mean", "std", "count", "min", "max"]})
            .reset_index()
        )
        student_metrics.columns = ["id_student", "code_module", "code_presentation", "avg_score", "score_std", "num_assessments", "min_score", "max_score"]
        
        df = student_info.merge(student_metrics, on=["id_student", "code_module", "code_presentation"], how="left")
        
        # Features
        df["avg_grade"] = df["avg_score"].fillna(0)
        df["grade_consistency"] = 100 - df["score_std"].fillna(0)
        df["grade_range"] = df["max_score"] - df["min_score"]
        df["assessment_completion_rate"] = df["num_assessments"] / (df["num_assessments"].max() or 1)
        df["low_performance"] = (df["avg_grade"] < 40).astype(int)
        df["low_engagement"] = (df["num_assessments"] < df["num_assessments"].median()).astype(int)
        df["has_previous_attempts"] = (df["num_of_prev_attempts"] > 0).astype(int)
        df["is_at_risk"] = df["final_result"].apply(lambda x: 1 if x in ["Fail", "Withdrawn"] else 0)
        
        output_cols = [
            "id_student", "code_module", "code_presentation", "gender", "region",
            "highest_education", "age_band", "final_result", "avg_grade",
            "grade_consistency", "grade_range", "num_assessments",
            "assessment_completion_rate", "studied_credits", "num_of_prev_attempts",
            "low_performance", "low_engagement", "has_previous_attempts", "is_at_risk"
        ]
        
        # Save processed data to temp file
        processed_file = DATA_DIR / "processed_data.pkl"
        df[output_cols].to_pickle(processed_file)
        
        print(f"Processed {len(df)} records and saved to {processed_file}")
        return str(processed_file)

    ## Step 4: Load to PostgreSQL with UPSERT
    @task
    def load_data_to_postgres(processed_file_path):
        postgres_hook = PostgresHook(postgres_conn_id='neondb_remote_host')
        
        # Load from pickle file
        df = pd.read_pickle(processed_file_path)
        
        target_fields = [
            "id_student", "code_module", "code_presentation", "gender", "region",
            "highest_education", "age_band", "final_result", "avg_grade",
            "grade_consistency", "grade_range", "num_assessments",
            "assessment_completion_rate", "studied_credits", "num_of_prev_attempts",
            "low_performance", "low_engagement", "has_previous_attempts", "is_at_risk"
        ]
        
        # Replace NaN with None (NULL in PostgreSQL)
        df_clean = df[target_fields].replace({float('nan'): None})
        
        # Create staging table (regular table, not temp)
        staging_table_query = """
        DROP TABLE IF EXISTS staging_student_risk;
        
        CREATE TABLE staging_student_risk (
            id_student BIGINT,
            code_module VARCHAR(20),
            code_presentation VARCHAR(20),
            gender VARCHAR(10),
            region VARCHAR(100),
            highest_education VARCHAR(100),
            age_band VARCHAR(20),
            final_result VARCHAR(20),
            avg_grade FLOAT,
            grade_consistency FLOAT,
            grade_range FLOAT,
            num_assessments INTEGER,
            assessment_completion_rate FLOAT,
            studied_credits INTEGER,
            num_of_prev_attempts INTEGER,
            low_performance INTEGER,
            low_engagement INTEGER,
            has_previous_attempts INTEGER,
            is_at_risk INTEGER
        );
        """
        postgres_hook.run(staging_table_query)
        
        # Insert data into staging table with cleaned data
        postgres_hook.insert_rows(
            table="staging_student_risk",
            rows=df_clean.values.tolist(),
            target_fields=target_fields
        )
        
        # Add unique constraint if not exists (required for UPSERT)
        add_constraint_query = """
        DO $$ 
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint 
                WHERE conname = 'oulad_student_risk_unique_key'
            ) THEN
                ALTER TABLE oulad_student_risk 
                ADD CONSTRAINT oulad_student_risk_unique_key 
                UNIQUE (id_student, code_module, code_presentation);
            END IF;
        END $$;
        """
        postgres_hook.run(add_constraint_query)
        
        # Perform UPSERT: Insert new records and update existing ones
        upsert_query = """
        INSERT INTO oulad_student_risk (
            id_student, code_module, code_presentation, gender, region,
            highest_education, age_band, final_result, avg_grade,
            grade_consistency, grade_range, num_assessments,
            assessment_completion_rate, studied_credits, num_of_prev_attempts,
            low_performance, low_engagement, has_previous_attempts, is_at_risk
        )
        SELECT * FROM staging_student_risk
        ON CONFLICT (id_student, code_module, code_presentation) 
        DO UPDATE SET
            gender = EXCLUDED.gender,
            region = EXCLUDED.region,
            highest_education = EXCLUDED.highest_education,
            age_band = EXCLUDED.age_band,
            final_result = EXCLUDED.final_result,
            avg_grade = EXCLUDED.avg_grade,
            grade_consistency = EXCLUDED.grade_consistency,
            grade_range = EXCLUDED.grade_range,
            num_assessments = EXCLUDED.num_assessments,
            assessment_completion_rate = EXCLUDED.assessment_completion_rate,
            studied_credits = EXCLUDED.studied_credits,
            num_of_prev_attempts = EXCLUDED.num_of_prev_attempts,
            low_performance = EXCLUDED.low_performance,
            low_engagement = EXCLUDED.low_engagement,
            has_previous_attempts = EXCLUDED.has_previous_attempts,
            is_at_risk = EXCLUDED.is_at_risk,
            created_at = CURRENT_TIMESTAMP;
        
        DROP TABLE staging_student_risk;
        """
        postgres_hook.run(upsert_query)
        
        # Get statistics
        stats_query = """
        SELECT 
            COUNT(*) as total_records,
            COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 minute') as recently_updated
        FROM oulad_student_risk;
        """
        stats = postgres_hook.get_first(stats_query)
        
        print(f"UPSERT completed: {stats[0]} total records, {stats[1]} updated in this run")
        
        # Cleanup temp files
        Path(processed_file_path).unlink(missing_ok=True)
        (Path(processed_file_path).parent / "extracted_data.pkl").unlink(missing_ok=True)

    # Dependencies
    table_ready = create_table()
    download_complete = download_kaggle_dataset()
    data = extract_oulad_data()
    processed = preprocess_oulad_data(data)
    load_status = load_data_to_postgres(processed)

    table_ready >> download_complete >> data >> processed >> load_status

