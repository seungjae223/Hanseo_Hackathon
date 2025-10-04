import { useState } from "react";
import "../css/Mypage.css";
import bg1 from '../image/background1.png';
import bg2 from '../image/background2.png';
import back from '../image/back.png';
import set from '../image/setting.png';
import pfi1 from '../image/pfi1.png';
import pfi2 from '../image/pfi2.png';
import pfi3 from '../image/pfi3.png';

export default function Mypage() {
  const profileImages = [pfi1, pfi2, pfi3]; // 프로필 이미지 배열
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "주노",
    nickname: "Juno",
    grade: "3학년",
    dept: "컴퓨터공학과",
    email: "juno@hanseo.ac.kr",
    tags: ["#태그1", "#태그2", "#태그3"],
    profileImage: pfi1 // 기본 프로필 이미지
  });

  // 프로필 정보 변경
  const handleChange = (e, field) => {
    setProfile({ ...profile, [field]: e.target.value });
  };

  // 프로필 이미지 변경 (순환)
  const handleImageChange = () => {
    const currentIndex = profileImages.indexOf(profile.profileImage);
    const nextIndex = (currentIndex + 1) % profileImages.length;
    setProfile({ ...profile, profileImage: profileImages[nextIndex] });
  };

  return (
    <div className="container">
      <img src={bg1} alt="뒷배경1" className="background1"/>
      <img src={bg2} alt="뒷배경2" className="background2"/>
      <img src={back} alt="뒤로가기" className="back"/>
      <img src={set} alt="설정 아이콘" className="setting"/>
      <p className="pf">프로필 설정</p>

      {/* 대표 프로필 이미지 (흰 칸 클릭 시 변경) */}
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
          {editing ? 
            <input type="text" value={profile.grade} onChange={(e) => handleChange(e, "grade")} /> :
            <span className="value">{profile.grade}</span>
          }
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
          {editing ? 
            <input 
              type="text" 
              value={profile.tags.join(", ")} 
              onChange={(e) => setProfile({
                ...profile, 
                tags: e.target.value.split(", ")
              })} 
            /> :
            <div className="tags">
              {profile.tags.map((tag, idx) => 
                <span key={idx} className="tag">{tag}</span>
              )}
            </div>
          }
        </div>
      </div>

      {!editing && <button className="logout-btn">로그아웃</button>}
      {editing && <button className="logout-btn" onClick={() => setEditing(false)}>완료</button>}
    </div>
  );
}
