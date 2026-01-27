/**
 * XAI Modals Container
 * Groups all modal components for the XAI Prediction feature
 */

import { useXAI } from '../../core/context/XAIContext';
import { CustomizeModal } from '../../ui/modal/CustomizeModal';
import { ShareModal } from '../../features/share-prediction/ShareModal';
import { WhatIfModal } from '../../features/what-if-analysis/WhatIfModal';

/**
 * Container component that renders all modals for XAI Prediction
 * Accesses modal and UI state directly from context
 */
export function XAIModals() {
    const { modal, ui, prediction, form } = useXAI();

    return (
        <>
            <CustomizeModal
                show={modal.showCustomizeModal}
                newActionItem={modal.newActionItem}
                onClose={modal.closeModal}
                onTitleChange={modal.updateTitle}
                onDescriptionChange={modal.updateDescription}
                onPriorityChange={modal.updatePriority}
                onCategoryChange={modal.updateCategory}
                onAdd={modal.addCustomAction}
            />

            <ShareModal
                show={ui.showShareModal}
                shareLink={ui.shareLink}
                onClose={ui.closeShareModal}
                onCopy={ui.copyToClipboard}
            />

            {prediction.prediction && (
                <WhatIfModal
                    show={ui.showWhatIfModal}
                    onClose={ui.closeWhatIfModal}
                    currentPrediction={prediction.prediction}
                    formData={form.formData}
                    onSimulate={ui.simulateScenario}
                />
            )}
        </>
    );
}
