interface StoryModalProps {
    isOpen: boolean;
    storyName: string;
    onStoryNameChange: (name: string) => void;
    onClose: () => void;
}

export const StoryModal = ({ isOpen, storyName, onStoryNameChange, onClose }: StoryModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>نام داستان را وارد کنید</h2>
                <input
                    type="text"
                    value={storyName}
                    onChange={(e) => onStoryNameChange(e.target.value)}
                    placeholder="نام داستان"
                    className="story-name-input"
                />
                <button className="modal-button" onClick={onClose}>
                    تایید
                </button>
            </div>
        </div>
    );
};