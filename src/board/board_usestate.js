import React from "react"

export default function UseState(initialValue){
    
    var _val = initialValue;
    function state() {
      return _val;
    }
    function setState(newVal) {
      _val = newVal; 
    }
    return [state, setState];
}