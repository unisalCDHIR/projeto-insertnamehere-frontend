import React from 'react';
export const BOARDS_NAME= "";
export const BOARDS_LENGTH = 0;
export const HasBoards = () => localStorage.getItem(BOARDS_LENGTH) !== null;
export const GetBoardsLength = () => localStorage.getItem(BOARDS_LENGTH);
export const SetBoardsLength = length =>{
    localStorage.setItem(BOARDS_LENGTH, length);
};
export const SetBoards = boards_name => {
  localStorage.setItem(BOARDS_NAME, boards_name);
};