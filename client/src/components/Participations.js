import { styled } from 'styled-components';
import PropTypes from 'prop-types';

const ContentList = styled.ul`
  display: flex;
  list-style-type: none;
  width: 70vw;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const ContentItem = styled.li`
  width: 16em;
  height: 16em;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 20px;

  img {
    width: 16em;
    height: 16em;
  }
`;

const Participations = ({ myData, memberData, handleMovingBoard }) => {
  console.log(memberData, myData);

  return (
    <ContentList>
      {memberData
        ? memberData.applicants.map((el) => {
            return (
              <ContentItem
                key={el.boardId}
                onClick={() => handleMovingBoard(el.boardId)}
              >
                <img src={el.imgUrl} alt="찜한 목록" />
              </ContentItem>
            );
          })
        : myData.applicants.map((el) => {
            return (
              <ContentItem
                key={el.boardId}
                onClick={() => handleMovingBoard(el.boardId)}
              >
                <img src={el.imgUrl} alt="찜한 목록" />
              </ContentItem>
            );
          })}
    </ContentList>
  );
};

Participations.propTypes = {
  myData: PropTypes.object.isRequired,
  memberData: PropTypes.object.isRequired,
  handleMovingBoard: PropTypes.func.isRequired,
};

export default Participations;