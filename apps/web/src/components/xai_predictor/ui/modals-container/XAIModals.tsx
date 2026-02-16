/**
 * XAI Modals Container
 * Groups all modal components for the XAI Prediction feature
 */

import { useXAILogic } from '../../core/hooks/useXAILogic';
import { ShareModal } from '../../features/share-prediction/ShareModal';
import { WhatIfModal } from '../../features/what-if-analysis/WhatIfModal';
import { CustomizeModal } from '../../ui/modal/CustomizeModal';

/**
 * Container component that renders all modals for XAI Prediction
 * Accesses modal and UI state directly from context
 */
export function XAIModals() {
    const { modal, ui, prediction, form } = useXAILogic();

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

            <WhatIfModal
                show={ui.showWhatIfModal && !!prediction.prediction}
                onClose={ui.closeWhatIfModal}
                currentPrediction={prediction.prediction!}
                formData={form.formData}
                onSimulate={ui.simulateScenario}
            />
        </>
    );
}
