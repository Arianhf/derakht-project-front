import { useState, useEffect } from "react";
import "./story.scss";
import { useParams, useNavigate } from "react-router-dom";
import { toPersianNumber } from "../utils/convertToPersianNumber";
import { storyService } from "../services/storyService";
import {StoryTemplate} from "../types/story.ts";

const StoryPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [template, setTemplate] = useState<StoryTemplate | null>(null);
    const [texts, setTexts] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [storyName, setStoryName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            if (!id) return;

            try {
                const response = await storyService.getStoryById(id);
                setTemplate(response);
                setTexts(new Array(response.template_parts.length).fill(""));
            } catch (err) {
                setError("خطا در دریافت قالب داستان");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [id]);

    const handleImageSelect = (index: number) => {
        setSelectedIndex(index);
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newTexts = [...texts];
        newTexts[selectedIndex] = event.target.value;
        setTexts(newTexts);
    };

    const handleNextImage = () => {
        if (selectedIndex < (template?.template_parts.length ?? 0) - 1) {
            setSelectedIndex(selectedIndex + 1);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleModalClose = async () => {
        if (!template) return;

        try {
            const formData = new FormData();
            formData.append('title', storyName);
            formData.append('template_id', template.id);

            const storyContent = template.template_parts.map((part, index) => ({
                template_part_id: part.id,
                text: texts[index],
                position: part.position
            }));
            console.log(storyContent);
            console.log(texts);
            formData.append('content', JSON.stringify(storyContent));
            console.log(formData);
            await storyService.createStory(formData);
            setIsModalOpen(false);
            navigate('/stories');
        } catch (err) {
            console.error('Error saving story:', err);
            alert('خطا در ذخیره داستان');
        }
    };

    if (loading) return <div>در حال بارگذاری...</div>;
    if (error) return <div>{error}</div>;
    if (!template) return <div>قالب داستان یافت نشد</div>;

    return (
        <div className="story-page">
            <nav className="navbar">
                {/* ... navbar content remains the same ... */}
            </nav>

            <div className="page-content">
                <div className="right-content">
                    <div className="image-container">
                        <img
                            src={template.template_parts[selectedIndex]?.illustration || ''}
                            alt={`تصویر ${selectedIndex + 1}`}
                            className="story-image"
                        />
                    </div>
                </div>

                <div className="story-container">
                    <div className="story-text">
                        <textarea
                            value={texts[selectedIndex] || ""}
                            onChange={handleTextChange}
                            placeholder={template.template_parts[selectedIndex]?.prompt_text || "داستان خود را بنویسید..."}
                            className="story-input"
                        />
                    </div>
                    <div className="button-container">
                        <button
                            className="prev-button"
                            onClick={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
                            disabled={selectedIndex === 0}
                        >
                            قبلی
                        </button>

                        <button className="submit-button" onClick={handleNextImage}>
                            {selectedIndex === template.template_parts.length - 1 ? "پایان" : "ادامه"}
                        </button>
                    </div>
                </div>

                <div className="left-content">
                    <div className="button-group">
                        <button className="action-button">بارگذاری تصویر</button>
                        <button className="action-button">ضبط صدا</button>
                    </div>
                    <hr className="divider" />
                    <div className="image-gallery">
                        {template.template_parts.map((part, index) => (
                            <div key={part.id} className="gallery-item">
                                {selectedIndex === index && (
                                    <span className="image-number">
                                        {toPersianNumber(index + 1)}
                                    </span>
                                )}

                                <span
                                    className="guide-icon"
                                    onClick={() => alert(part.prompt_text)}
                                >
                                    ?
                                </span>

                                <img
                                    src={part.illustration || ''}
                                    alt={`تصویر ${index + 1}`}
                                    className={`gallery-image ${selectedIndex === index ? "selected" : ""}`}
                                    onClick={() => handleImageSelect(index)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>نام داستان را وارد کنید</h2>
                        <input
                            type="text"
                            value={storyName}
                            onChange={(e) => setStoryName(e.target.value)}
                            placeholder="نام داستان"
                            className="story-name-input"
                        />
                        <button className="modal-button" onClick={handleModalClose}>
                            تایید
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryPage;