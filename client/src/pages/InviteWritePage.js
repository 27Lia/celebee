import { useState } from 'react';
import axios from 'axios';
import MapKakao from '../services/MapKakao';
import { styled } from 'styled-components';
import CategoryBtn from '../components/CategoryBtn';
import CategoryMappings from '../components/CategoryMappings';
import { BiEdit } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

function InviteWritePage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    trigger,
  } = useForm();
  console.log(handleSubmit);
  const token = localStorage.getItem('jwtToken');
  const api = 'https://api.celebee.kro.kr';
  const navigate = useNavigate();

  const [selectedButton, setSelectedButton] = useState(null);
  const [imageFromServer, setImageFromServer] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const onSubmit = (data) => {
    if (!selectedImage) {
      alert('이미지를 선택해주세요.');
      return;
    }
    data.category = selectedButton;
    data.imageUrl = selectedImage;

    axios
      .post(`${api}/boards/new-boards`, data, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        navigate(`/boards/${response.data.boardId}`);
      })
      .catch((error) => {
        console.error('Error creating card:', error);
      });
  };

  // 입력값 관리
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (
      name === 'date' &&
      new Date(value) < new Date(ThreeDaysAfterCurrentDate)
    ) {
      alert(
        '작성하시려는 모임의 마감일은 오늘입니다. 모집일은 오늘로부터 3일 후부터 가능합니다. ',
      );
      return;
    }

    if (name === 'money') {
      const numericValue = parseInt(value.replace(/,/g, ''), 10) || 0; // 콤마 제거 후 숫자로 변환, 숫자가 아니라면 0

      // 백만원 초과 검증
      if (numericValue > 1000000) {
        alert('백만원을 초과할 수 없습니다.');
        return;
      }

      setValue('money', numericValue); // 상태는 숫자로 관리
      e.target.value = numericValue.toLocaleString('en-US');
    } else {
      // 나머지 인풋에 대한 값 설정
      setValue(name, value);
    }
  };

  const getCurrentDateInKST = () => {
    return new Date()
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Seoul',
      })
      .replace(/\./g, '-')
      .replace(/\s/g, '') // 공백 제거
      .slice(0, -1);
  };

  const getDaysAfterInKST = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Seoul',
      })
      .replace(/\./g, '-')
      .replace(/\s/g, '') // 공백 제거
      .slice(0, -1);
  };

  const ThreeDaysAfterCurrentDate = getDaysAfterInKST(3);
  const currentDate = getCurrentDateInKST();

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 카테고리 버튼 클릭
  const handleCategoryButtonClick = async (buttonId) => {
    setSelectedButton(buttonId);

    setSelectedImage(null);
    setValue('category', buttonId);
    setValue('imageUrl', null);
    try {
      const response = await axios.get(`${api}/cards/${buttonId}/images`);
      setImageFromServer(response.data);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  // 지도 좌표 전달
  const handleLocationSelect = (latitude, longitude, address) => {
    if (!address) {
      setError('address');
    } else {
      // 주소가 입력되었을 때 처리 로직
      setValue('latitude', latitude);
      setValue('longitude', longitude);
      setValue('address', address);
    }
  };

  const handleModalClick = () => {
    if (!selectedButton) {
      alert('카테고리를 선택해주세요');
      return;
    }
    setIsModalOpen((prevState) => !prevState);
  };

  const handleImageClick = async (imageUrl) => {
    setSelectedImage(imageUrl);
    setValue(imageUrl, imageUrl);
  };

  const handleModalBackgroundClick = (event) => {
    // 클릭된 요소가 모달 배경인지 확인
    if (event.target === event.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const handleNextImage = () => {
    if (currentIndex < imageFromServer.length - 1) {
      // 마지막 이미지가 아니라면
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentIndex > 0) {
      // 첫 번째 이미지가 아니라면
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <StyledWritePage>
      <section>
        <button
          className="modal-btn"
          aria-label="모달 열기"
          onClick={handleModalClick}
        >
          <BiEdit className="edit-btn" />
        </button>
        <form onSubmit={handleSubmit(onSubmit)}>
          <article>
            <div className="card-container">
              <div className="image-container">
                {selectedImage ? (
                  <img
                    className="main-img"
                    src={selectedImage}
                    alt="선택된 카테고리의 이미지"
                  />
                ) : (
                  <img
                    className="main-img"
                    src="https://celebeeimage.s3.ap-northeast-2.amazonaws.com/board/CATEGORY_ETC/CATEGORY_ETC1.png"
                    alt="기본 이미지"
                  />
                )}
              </div>
              <div className="btn-box">
                <button className="submit-btn" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </article>
        </form>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <article className="form-box">
              <label>
                제목
                <input
                  className="title-date"
                  type="text"
                  {...register('title', {
                    required: '제목을 입력해주세요.',
                  })}
                  onBlur={() => {
                    // onBlur 이벤트가 발생하면 해당 필드의 유효성을 검사합니다.
                    trigger('title');
                  }}
                  onChange={handleInputChange}
                />
              </label>
              {errors.title && (
                <span className="error-text">{errors.title.message}</span>
              )}
              <div className="date-box">
                <label>
                  날짜
                  <input
                    className="date-date"
                    type="date"
                    {...register('date', {
                      required: '날짜를 선택해주세요.',
                      min: currentDate,
                    })}
                    onBlur={() => {
                      // onBlur 이벤트가 발생하면 해당 필드의 유효성을 검사합니다.
                      trigger('date');
                    }}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  인원
                  <input
                    className="person-date"
                    type="number"
                    {...register('totalNum', {
                      required: '인원 수를 선택해주세요.',
                      min: {
                        value: 1,
                        message: '인원 수는 1 이상이어야 합니다.',
                      },
                    })}
                    onBlur={() => {
                      // onBlur 이벤트가 발생하면 해당 필드의 유효성을 검사합니다.
                      trigger('totalNum');
                    }}
                    onChange={(e) => {
                      if (e.target.value < 1) {
                        e.target.value = 1; // If the user tries to enter a value less than 1, it resets to 1
                      }
                      handleInputChange(e);
                    }}
                  />
                </label>{' '}
                {errors.date && (
                  <div className="error-text">{errors.date.message}</div>
                )}
                {errors.totalNum && (
                  <div className="error-text">{errors.totalNum.message}</div>
                )}
              </div>
              <label>
                N/1 금액
                <input
                  className="money-date"
                  type="text"
                  {...register('money', {
                    validate: (value) => {
                      if (!value) return true; // 입력값이 없는 경우 검증을 통과시킵니다.
                      const numericValue = parseInt(
                        value.replace(/,/g, ''),
                        10,
                      );
                      return !isNaN(numericValue) && numericValue >= 1;
                    },
                  })}
                  onChange={(e) => {
                    const numericString = e.target.value.replace(/[^0-9]/g, '');
                    setValue('money', numericString);
                    e.target.value = numberWithCommas(numericString);

                    handleInputChange(e);
                  }}
                />
              </label>
              <label>
                내용
                <textarea
                  className="body-date"
                  {...register('body', {
                    required: '내용을 입력해주세요.',
                    maxLength: {
                      value: 255,
                      message: '본문의 글자 수는 255글자를 넘을 수 없습니다.',
                    },
                  })}
                  onBlur={() => {
                    // onBlur 이벤트가 발생하면 해당 필드의 유효성을 검사합니다.
                    trigger('body');
                  }}
                  onChange={handleInputChange}
                />
              </label>
              {errors.body && (
                <span className="error-text">{errors.body.message}</span>
              )}
            </article>
          </form>
          {isModalOpen && (
            <div
              className="modal-background"
              onClick={handleModalBackgroundClick}
              onKeyDown={handleModalBackgroundClick}
              role="button"
              tabIndex="0"
            >
              <div className="modal">
                <button className="pre-btn" onClick={handlePrevImage}>
                  이전
                </button>
                <button className="next-btn" onClick={handleNextImage}>
                  다음
                </button>
                <div
                  className="slider-container"
                  style={{ transform: `translateX(-${currentIndex * 220}px)` }}
                >
                  {imageFromServer.map((imageUrl, index) => (
                    <button
                      className="card-img-container" // 변경된 부분
                      key={index}
                      onClick={() => handleImageClick(imageUrl)}
                    >
                      <img
                        className="card-img"
                        src={imageUrl}
                        alt="카드이미지"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/*카테고리*/}
          <menu className="category-btn">
            {Object.keys(CategoryMappings)
              .filter((key) => key !== 'CATEGORY_ALL')
              .map((key) => {
                const buttonId = key;
                const isButtonSelected = selectedButton === buttonId;
                return (
                  <CategoryBtn
                    key={key}
                    isSelected={isButtonSelected}
                    className={isButtonSelected ? 'selected' : ''}
                    onClick={() => handleCategoryButtonClick(key)}
                    text={CategoryMappings[key]?.label}
                    color={CategoryMappings[key]?.backgroundColor}
                  />
                );
              })}
          </menu>
          <div className="search-box">
            <input
              type="text"
              id="address-input"
              placeholder="주소를 입력해주세요."
              {...register('address', {
                required: '주소를 입력해주세요.',
              })}
            />
            <button
              tabIndex="0"
              id="search-button"
              onClick={handleLocationSelect}
            >
              검색
            </button>
          </div>
          {errors.address && (
            <span className="error-text">주소를 검색 및 선택해주세요.</span>
          )}
          <MapKakao onSelectLocation={handleLocationSelect} showSearch={true} />
        </div>
      </section>
    </StyledWritePage>
  );
}

const StyledWritePage = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  section {
    position: relative;
    display: flex;
    gap: 20px;
    padding: 50px;
    max-width: 1280px;
    margin: 0 auto;
  }

  .btn-box {
    display: flex;
    justify-content: space-between;
  }

  .form-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: -7px;
    width: 450px;
  }
  input,
  textarea {
    width: 100%;
    background-color: rgba(244, 227, 233, 0.4);
    border: none;
    height: 40px;
    padding: 10px;
  }
  .error-text {
    color: red;
    font-size: 12px;
  }
  label {
    position: relative;
  }
  .form-box label > input,
  textarea,
  .submit-btn,
  .search-box,
  .main-img,
  #map {
    box-shadow: 4px 3px 10px rgba(0, 0, 0, 0.2);
  }

  #map {
    position: relative;
    height: 400px;
  }

  #listings {
    position: absolute;
    width: 200px;
    max-height: 300px;
    overflow-y: auto;
    background-color: rgba(255, 255, 255, 0);
    padding: 10px;
    z-index: 2;
  }
  #listings.filled {
    background-color: rgba(255, 255, 255, 0.8);
  }

  #toggleButton {
    width: 80px;
    height: 28px;
    border: 1px solid #ddd;
    cursor: pointer;
    z-index: 999;
    position: relative;
    background-color: whitesmoke;
  }
  .selected-item::before {
    content: '✔';
    color: red;
    margin-right: 5px;
  }
  .search-result-item {
    cursor: pointer;
    margin-bottom: 5px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
  }
  .main-img {
    width: 400px;
    height: 400px;
  }
  .date-box {
    display: grid;

    grid-template-columns: repeat(2, 1fr);
  }

  .body-date {
    min-height: 150px;
    max-height: 150px;
    max-width: 500px;
    min-width: 446px;
  }

  .search-box {
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 38px;
    background-color: whitesmoke;
    z-index: 2;
  }

  #address-input {
    background-color: transparent;
    width: 90%;
    height: 20px;
  }
  #search-button {
    width: 38px;
    height: 38px;
    background-color: rgba(244, 227, 233, 0.4);
    border: none;
  }
  .category-btn {
    margin: 16px 0px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 14px;
  }

  .edit-btn {
    width: 28px;
    height: 28px;
    color: whitesmoke;
    margin-top: 1px;
    cursor: pointer;
  }

  .submit-btn {
    position: relative;
    width: 100px;
    height: 38px;
    border: none;
    background-color: rgba(244, 227, 233, 0.4);
    left: 300px;
    margin-top: 10px;
  }

  .modal {
    position: absolute;
    z-index: 999;
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 20px;
    width: 600px;
    height: 430px;
    flex-wrap: wrap;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    overflow: hidden;
    box-shadow: 1px 1px 7px 5px rgb(0, 0, 0, 0.3);
  }

  .modal button {
    background-color: #fff;
    padding: 5px 10px;
    margin: 5px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .modal button:hover {
    background-color: #ddd;
  }

  .slider-container {
    display: flex;
    transition: transform 0.3s;
    width: 100%;
    transform: translateX(-220px);
  }

  .modal-btn {
    position: absolute;
    width: 38px;
    left: 50px;
    height: 38px;
    top: 412px;
    background-color: #d25bea;
    border: none;
    z-index: 1;
  }

  .modal-btn:active,
  .submit-btn:active,
  #toggleButton:active,
  #search-button:active {
    transform: translateY(1px); // 클릭 시 버튼을 아래로 2px 이동
    box-shadow: 1px 1px rgb(0, 0, 0, 0.2);
  }

  .card-img-container {
    width: 320px;
    height: 320px;
    border: none;
    box-shadow: 4px 3px 10px rgba(0, 0, 0, 0.2);
    margin: 0 10px;
  }

  .card-img {
    width: 300px;
    height: 300px;
  }

  .card-img:active {
    transform: translateY(1px);
  }

  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  @media (max-width: 768px) {
    section {
      flex-direction: column;
    }
    img {
      width: 100%;
      height: auto;
    }
    .modal-btn {
      top: 462px;
    }

    .submit-btn {
      left: 0px;
    }

    .main-img {
      width: 100%;
      height: 100%;
    }

    .modal {
      width: 360px;
      height: 400px;
      padding: 15px;
      overflow: scroll;
      border-radius: 0px;
    }
    .slider-container {
      flex-direction: column;
      transform: none !important;
    }

    .pre-btn,
    .next-btn {
      display: none;
    }
  }
  @media (min-width: 375px) and (max-width: 472px) {
    .modal {
      width: 90%;
      height: 400px;
      padding: 15px;
      overflow: scroll;
    }
    .slider-container {
      width: 100%;
      flex-direction: column;
      transform: none !important;
    }
    .modal-btn {
      right: 0px;
      top: 372px;
    }

    .image-container,
    .card-container {
      width: 360px;
      height: 100%;
    }

    .form-box {
      width: 360px;
    }
    .body-date {
      min-height: 150px;
      max-height: 150px;
      max-width: 500px;
      min-width: 360px;
    }

    .category-btn {
      li > button {
        width: 100%;
      }
    }
    .search-box,
    #map {
      width: 360px;
    }
  }
`;

export default InviteWritePage;
