import { styled } from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import CategoryBtn from '../components/CategoryBtn';

const HomePage = styled.div`
  display: flex;
  .main-header {
    display: flex;
    justify-content: center;
    height: 350px;
    margin-top: 156px;
    border: solid 1px black;
    align-items: center;
  }
  .service-introduction {
    color: white;
  }
  .search-container {
    display: flex;
    justify-content: center;
  }
  .search {
    display: flex;
    width: 600px;
    height: 55px;
    border: solid 1px black;
    border-radius: 10px;
    align-items: center;
    justify-content: space-between;
  }
  .search {
    padding-left: 30px;
  }
  .icon-search {
    padding-right: 10px;
  }
  .categorys-container {
    display: flex;
    flex-direction: row;
    list-style: none;
    justify-content: center;
    padding: 0;
    margin: 20px 0px;
  }
`;

export default function Homepage() {
  return (
    <HomePage>
      <div className="main-container">
        <div className="main-header">
          <h1 className="service-introduction">
            Hi! Make new friends at Celebee 🐝
          </h1>
        </div>
        <div className="categorys-container">
          <ul className="categorys-container">
            <CategoryBtn text="All" color="#C471ED" />
            <CategoryBtn text="Leisure" color="#FF6AC6" />
            <CategoryBtn text="Travel" color="#FF7D99" />
            <CategoryBtn text="Game" color="#FFA472" />
            <CategoryBtn text="Culture" color="#FFD05F" />
            <CategoryBtn text="Education" color="#4CA899" />
            <CategoryBtn text="ETC" color="#F9F871" />
          </ul>
        </div>
        <div className="search-container">
          <div className="search">
            <span className="search-text">Search</span>
            <div className="icon-search">
              <FaSearch />
            </div>
          </div>
        </div>
        <div className="invitiation-container">{/* 초대장 컴포넌트 */}</div>
      </div>
    </HomePage>
  );
}
