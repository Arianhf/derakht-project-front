import { useState } from "react";
import "./story.scss";
import { ArrowLeft } from "lucide-react";
import logo from "../assets/images/logo2.png";
import sideStory1 from "../assets/images/blogimage1.jpg";
import sideStory2 from "../assets/images/story.png";
import sideStory3 from "../assets/images/story.png";
import sideStory4 from "../assets/images/story.png";
import sideStory5 from "../assets/images/story.png";
import sideStory6 from "../assets/images/story.png";
import { toPersianNumber } from "../utils/convertToPersianNumber";

const images = [sideStory1, sideStory2, sideStory3, sideStory4, sideStory5, sideStory6];

const StoryPage = () => {
    const [selectedIndex, setSelectedIndex] = useState(0); // Track selected image index
    const [texts, setTexts] = useState(Array(images.length).fill("")); // Store text for each image

    const handleImageSelect = (index) => {
        setSelectedIndex(index);
    };

    const handleTextChange = (event) => {
        const newTexts = [...texts];
        newTexts[selectedIndex] = event.target.value;
        setTexts(newTexts);
    };

    const handleNextImage = () => {
        if (selectedIndex < images.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };

    return (
        <div className="story-page">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-left">
                    <div className="back-icon">
                        <ArrowLeft size={20} color="#345BC0" />
                    </div>
                </div>
                <div className="navbar-center">
                    <ul className="navbar-items">
                        <li>خانه</li>
                        <li>درباره ما</li>
                        <li>تماس با ما</li>
                    </ul>
                </div>
                <div className="navbar-right">
                    <div className="logo">
                        <img src={logo} alt="لوگو" />
                    </div>
                </div>
            </nav>

            <div className="page-content">
                {/* Story Content */}
                <div className="story-container">
                    <div className="story-text">
                        <textarea
                            value={texts[selectedIndex]}
                            onChange={handleTextChange}
                            placeholder="اینجا متن داستان را بنویسید..."
                            className="story-input"
                        />
                    </div>
                    <button className="submit-button" onClick={handleNextImage} disabled={selectedIndex === images.length - 1}>
                        {selectedIndex === images.length - 1 ? "پایان" : "ثبت"}
                    </button>
                </div>

                {/* Right Content - Main Image */}
                <div className="right-content">
                    <div className="image-container">
                        <img src={images[selectedIndex]} alt="داستان" className="story-image" />
                    </div>
                    <div className="rectangle-container">
                        <button className="help-button">راهنمایی</button>
                    </div>
                </div>

                {/* Left Content - Image Selection */}
                <div className="left-content">
                    <div className="button-group">
                        <button className="action-button">بارگذاری تصویر</button>
                        <button className="action-button">ضبط صدا</button>
                    </div>
                    <hr className="divider" />
                    <div className="image-gallery">
                        {images.map((image, index) => (
                            <div key={index} className="gallery-item">
                                {selectedIndex === index && (
                                    <span className="image-number">{toPersianNumber(index + 1)}</span>
                                )}
                                <img
                                    src={image}
                                    alt={`تصویر ${index + 1}`}
                                    className={`gallery-image ${selectedIndex === index ? "selected" : ""}`}
                                    onClick={() => handleImageSelect(index)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryPage;
