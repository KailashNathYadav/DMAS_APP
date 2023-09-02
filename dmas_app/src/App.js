import {useReducer} from 'react';
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";

export const ACTIONS = {
  //ADD_DIGIT also include decimal
  AC : "all-clear",
  DEL : "delete",
  ADD_DIGIT: "add-digit",
  ADD_OPERATOR: "add-operator",
  EVALUATE: "evaluate"
}


function reducer(state,{type , payload}){
  switch(type){
    case ACTIONS.AC:
      return {};
    case ACTIONS.DEL:
      //overwrite
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      //currentOperand is null 
      if(state.currentOperand === null)
        return state;
      //currentOperand is of length 1
      if(state.currentOperand.length === 1)
        return {...state,currentOperand: null};
      //otherwise split(0,-1)
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0,-1),
      }
    case ACTIONS.ADD_DIGIT:
      //overwrite
      if(state.overwrite) return {
        ...state,
        overwrite: false,
        currentOperand: payload.digit
      }
      //0000
      if(state.currentOperand === "0" && payload.digit === "0")
        return state;
      //...
      if(payload.digit === "." && state.currentOperand.includes(".")) 
        return state;
      return {
        ...state,
        currentOperand : `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.ADD_OPERATOR:
      //both operand null return state
      if(state.currentOperand == null && state.previousOperand == null)
        return state;
      //currentOperand null 
      if(state.currentOperand == null)
        return {
          ...state,
          operator: payload.operator,
        }
      //previousOperand null 
      if(state.previousOperand == null)
        return {
          ...state,
          operator: payload.operator,
          previousOperand: state.currentOperand,
          currentOperand: null,
      }
      //evaluate and save in previous
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operator,
        currentOperand: null,
      }
    case ACTIONS.EVALUATE:
      if(state.currentOperand === null ||
        state.previousOperand === null ||
        state.operator == null)
        return state;

      return {
        ...state,
        currentOperand : evaluate(state),
        previousOperand : null,
        overwrite: true,
        operator: null
      }
  }
}

function evaluate({currentOperand , previousOperand , operator}){
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if(isNaN(prev) || isNaN(curr))  return "";
  let computation = "";
  switch(operator){
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "÷":
      computation = prev / curr;
      break;
  }
  return computation.toString();
}

function App() {
  const [{currentOperand,previousOperand,operator},dispatch] = useReducer(reducer,{});
  
  return (
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">{previousOperand} {operator}</div>
          <div className="current-operand">{currentOperand}</div>
        </div>
        <button className="span-two" onClick={()=>dispatch({ type: ACTIONS.AC})}>AC</button>
        <button onClick={()=>dispatch({type: ACTIONS.DEL})}>DEL</button>
        <OperationButton operator="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operator="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operator="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operator="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button className="span-two" onClick={()=>dispatch({type: ACTIONS.EVALUATE})}>=</button>
      </div>
  );
}

export default App;
