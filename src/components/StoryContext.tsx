interface StoryContentProps {
    selectedIndex: number;
    texts: string[];
    imagesLength: number;
    onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onNavigate: (direction: 'next' | 'prev') => void;
}

export const StoryContent = ({
    selectedIndex,
    texts,
    imagesLength,
    onTextChange,
    onNavigate
}: StoryContentProps) => (
    <div className="story-container">
        <div className="story-text">
            <textarea
                value={texts[selectedIndex]}
                onChange={onTextChange}
                placeholder="اینجا متن داستان را بنویسید..."
                className="story-input"
            />
        </div>
        <div className="button-container">
        <button
            className="prev-button"
            onClick={() => onNavigate('prev')}
            disabled={selectedIndex === 0}
        >
        قبلی
        </button>
        <button
        className="submit-button"
        onClick={() => onNavigate('next')}
        >
        {selectedIndex === imagesLength - 1 ? "پایان" : "ادامه"}
        </button>
            </div>
        </div>
    );