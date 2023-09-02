import { ACTIONS } from "./App";

const OperationButton = ({dispatch, operator}) => {
  return (
    <button onClick={()=>dispatch({type: ACTIONS.ADD_OPERATOR , payload : {operator}})}>
      {operator}
    </button>
  )
}

export default OperationButton;
