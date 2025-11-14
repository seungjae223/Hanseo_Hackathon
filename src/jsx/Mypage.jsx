import { useState } from "react";
import "../css/Mypage.css";
import back from '../image/back.png';
import pfi1 from '../image/pfi1.png';
import pfi2 from '../image/pfi2.png';
import pfi3 from '../image/pfi3.png';
import { useNavigate } from "react-router-dom";

export default function Mypage() {
  const navigate = useNavigate();
  const handleStartClick = () => navigate("/main");

  const profileImages = [pfi1, pfi2, pfi3];
  const [editing, setEditing] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);

  const [profile, setProfile] = useState({
    name: "주노",
    nickname: "Juno",
    grade: "3학년",
    dept: "컴퓨터공학과",
    email: "juno@hanseo.ac.kr",
    tags: ['친절함','활발함','유머감'],
    profileImage: pfi1
  });

  const handleChange = (e, field) => {
    setProfile({ ...profile, [field]: e.target.value });
  };

  const handleImageChange = () => {
    const currentIndex = profileImages.indexOf(profile.profileImage);
    const nextIndex = (currentIndex + 1) % profileImages.length;
    setProfile({ ...profile, profileImage: profileImages[nextIndex] });
  };

  const handleTagClick = (tag) => {
    const alreadySelected = profile.tags.includes(tag);
    let updatedTags;

    if (alreadySelected) {
      updatedTags = profile.tags.filter(t => t !== tag);
    } else if (profile.tags.length < 3) {
      updatedTags = [...profile.tags, tag];
    } else {
      return alert("최대 3개까지 선택할 수 있습니다!");
    }

    setProfile({ ...profile, tags: updatedTags });
  };

  const personality = ["친절함", "활발함", "유머감", "배려심", "사교성", "인내심"];
  const ability = ["문제 해결", "신속 처리", "창의 발생", "논리 정연", "실행 능력", "경험적", "협업 능력", "효율 추구", "발표 능력", "학습 능력"];
  const attitude = ["적극 참여", "출석 수범", "긍정 사고", "배움 열정", "성실 노력", "책임 완수", "공감 능력", "도전 의지", "목표 지향"];

  return (
    <div className="container">
      <img src={back} alt="뒤로가기" className="back" onClick={handleStartClick}/>
      <p className="pf">프로필 설정</p>

      <div 
        className="white"
        onClick={editing ? handleImageChange : undefined}
        style={{cursor: editing ? "pointer" : "default"}}
      >
        <img 
          src={profile.profileImage} 
          alt="프로필"
          className={
            profile.profileImage === pfi1 ? "pfi1" :
            profile.profileImage === pfi2 ? "pfi2" : "pfi3"
          }
        />
      </div>

      <div className="pf-btn" onClick={() => setEditing(true)}>
        <p>프로필 설정</p>
      </div>

      <div className="profile-info">
        <div className="row">
          <span className="label">이름</span>
          {editing ? 
            <input type="text" value={profile.name} onChange={(e) => handleChange(e, "name")} /> :
            <span className="value">{profile.name}</span>
          }
        </div>

        <div className="row">
          <span className="label">닉네임</span>
          {editing ? 
            <input type="text" value={profile.nickname} onChange={(e) => handleChange(e, "nickname")} /> :
            <span className="value">{profile.nickname}</span>
          }
        </div>

        <div className="row">
          <span className="label">학년</span>
          {editing ? (
            <select
              value={profile.grade}
              onChange={(e) => handleChange(e, "grade")}
              className="grade-select"
            >
              <option value="1학년">1학년</option>
              <option value="2학년">2학년</option>
              <option value="3학년">3학년</option>
              <option value="4학년">4학년</option>
            </select>
          ) : (
            <span className="value">{profile.grade}</span>
          )}
        </div>

        <div className="row">
          <span className="label">학과</span>
          {editing ? 
            <input type="text" value={profile.dept} onChange={(e) => handleChange(e, "dept")} /> :
            <span className="value">{profile.dept}</span>
          }
        </div>

        <div className="row">
          <span className="label">이메일</span>
          {editing ? 
            <input type="text" value={profile.email} onChange={(e) => handleChange(e, "email")} /> :
            <span className="value">{profile.email}</span>
          }
        </div>

        <div className="row">
          <span className="label">관심태그</span>

          {editing ? (
            <div 
              className="tags-editable"
              onClick={() => setShowTagModal(true)}
            >
              {profile.tags.length > 0 ? (
                profile.tags.map((tag, idx) => (
                  <span key={idx} className="tag">{tag}</span>
                ))
              ) : (
                <span className="no-tag">선택된 태그 없음</span>
              )}
              <span className="add-tag">+ 태그 선택</span>
            </div>
          ) : (
            <div className="tags">
              {profile.tags.length > 0 ? (
                profile.tags.map((tag, idx) => 
                  <span key={idx} className="tag">{tag}</span>
                )
              ) : (
                <span className="no-tag">선택된 태그 없음</span>
              )}
            </div>
          )}
        </div>
      </div>

      {!editing && <button className="logout-btn">로그아웃</button>}
      {editing && <button className="logout-btn" onClick={() => setEditing(false)}>완료</button>}

      {/* ✅ 태그 3열 모달 */}
      {showTagModal && (
        <div className="modal-overlay" onClick={() => setShowTagModal(false)}>
          <div className="tag-modal" onClick={(e) => e.stopPropagation()}>
            


            <div className="tag-3col-grid">

              {/* 성격 */}
              <div className="tag-col">
                <p className="tag-col-title">성격</p>
                {personality.map((tag)=>(
                  <div
                    key={tag}
                    className={`tag-item-btn ${profile.tags.includes(tag)?'selected':''}`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </div>

              {/* 능력 */}
              <div className="tag-col">
                <p className="tag-col-title">능력</p>
                {ability.map((tag)=>(
                  <div
                    key={tag}
                    className={`tag-item-btn ${profile.tags.includes(tag)?'selected':''}`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </div>

              {/* 태도 */}
              <div className="tag-col">
                <p className="tag-col-title">태도</p>
                {attitude.map((tag)=>(
                  <div
                    key={tag}
                    className={`tag-item-btn ${profile.tags.includes(tag)?'selected':''}`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
