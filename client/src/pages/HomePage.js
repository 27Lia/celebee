import { styled } from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import CategoryBtn from '../components/CategoryBtn';
import CategoryMappings from '../components/CategoryMappings';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

const HomePage = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;

  .main-container {
    margin: 0px 320px;
  }

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
    width: 500px;
    height: 40px;
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
  .invitation-container {
    display: grid;
    flex-direction: row;
    margin-top: 20px;
    grid-template-columns: repeat(3, 1fr);
  }
  .invitation-item {
    display: flex;
    justify-content: center;
    height: 200px;
  }
`;

export default function Homepage() {
  const [invitation, setInvitation] = useState([]);

  const fetchMoreData = () => {
    axios

      .get('http://3.39.76.109:8080/boards')

      .then((response) => {
        const newData = response.data;
        const sortedInvitation = newData.sort(
          (a, b) => new Date(b.boardId) - new Date(a.boardId),
        );

        const uniqueSortedInvitation = sortedInvitation.filter((item) => {
          return !invitation.find(
            (existingItem) => existingItem.boardId === item.boardId,
          );
        });

        const updateInvitation = [...invitation, ...uniqueSortedInvitation];
        setInvitation(updateInvitation);
      })

      .catch((error) => {
        console.log('error', error);
      });
  };

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
            {Object.keys(CategoryMappings).map((key) => (
              <CategoryBtn
                key={key}
                text={CategoryMappings[key]?.label}
                color={
                  CategoryMappings[key]?.backgroundColor ||
                  CategoryMappings[key]?.color
                }
              />
            ))}
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
        <InfiniteScroll
          dataLength={invitation.length}
          next={fetchMoreData}
          hasMore={true}
          loader={invitation.length > 0 ? null : <h4>Loading</h4>}
          className="invitation-container"
        >
          {invitation.map((item) => (
            <Link
              key={item.boardId}
              to={`/boards/${item.boardId}`}
              className="invitation-item"
            >
              <h2>{item.title}</h2>
            </Link>
          ))}
        </InfiniteScroll>
      </div>
    </HomePage>
  );
}
