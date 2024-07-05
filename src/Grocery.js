

export default function Grocery({name, quantity, _id, removeGrocery}){

    return(
    <>
        <div className="grocery">
            <p>{name} (Quantity: {quantity})</p> <button onClick={()=>removeGrocery(_id)}>Delete</button>
        </div>
    </>
    );
}