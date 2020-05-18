import React from "react"
import uuid from "uuid/v4"; 

export default function DatatoFeed(boardCards){
      
      let itemsFromBackendBacklog = [];
      let itemsFromBackendToDo = [];
      let itemsFromBackendOnGoing = [];
      let itemsFromBackendDone = [];
    
      let lock = false;
    
      async function feedBoard() {
            boardCards.forEach(element => {
              if (element.column === "BACKLOG") {
                itemsFromBackendBacklog.push({ id: uuid(), content: element.description })
                console.log(itemsFromBackendBacklog);
              }
              else if (element.column === "TODO") {
                itemsFromBackendToDo.push({ id: uuid(), content: element.description })
              }
              else if (element.column === "ONGOING") {
                itemsFromBackendOnGoing.push({ id: uuid(), content: element.description })
              }
              else if (element.column === "DONE") {
                itemsFromBackendDone.push({ id: uuid(), content: element.description })
              }
            });
    
        }
    
        
        if(!lock){
            feedBoard();
            lock = true;
        }
        
        const columnsFromBackend = {
          [uuid()]: {
            name: "BACKLOG",
            items: itemsFromBackendBacklog
          },
          [uuid()]: {
            name: "TO DO",
            items: itemsFromBackendToDo
          },
          [uuid()]: {
            name: "ON GOING",
            items: itemsFromBackendOnGoing
          },
          [uuid()]: {
            name: "DONE",
            items: itemsFromBackendDone
          }
        };
    
        const columns = columnsFromBackend;
    
        return columns;
    
    }
