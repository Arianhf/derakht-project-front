import "./story.scss";
import { ArrowLeft } from "lucide-react";
import logo from "../assets/images/logo.svg";
import storyImage from "../assets/images/story.png";
import sideStory from "../assets/images/side_story.png";

const StoryPage = () => {
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
                {/* Left Content */}
                <div className="left-content">
                    <div className="button-group">
                        <button className="action-button">بارگذاری تصویر</button>
                        <button className="action-button">ضبط صدا</button>
                    </div>
                    <hr className="divider" />
                    <div className="image-gallery">
                        {Array(6).fill(null).map((_, index) => (
                            <img
                                key={index}
                                src={sideStory}
                                alt={`تصویر ${index + 1}`}
                                className="gallery-image"
                            />
                        ))}
                    </div>
                </div>
                {/* Story Content */}
                <div className="story-container">
                    <div className="story-text">
                        <p>اینجا متن داستان قرار می‌گیرد.</p>
                    </div>
                    <button className="submit-button">ثبت</button>
                </div>
                {/* Right Content */}
                <div className="right-content">
                    <div className="image-container">
                        <img src={storyImage} alt="داستان" className="story-image" />
                    </div>
                    <div className="rectangle-container">
                        <button className="help-button">راهنمایی</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryPage;
