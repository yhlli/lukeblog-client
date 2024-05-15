import { useContext, useEffect, useState } from "react";
import { address } from "../Header";
import { UserContext } from "../UserContext";

export default function BlackJack(){
    const [startGame, setStartGame] = useState(false);
    const [money, setMoney] = useState(1500);
    const [deck, setDeck] = useState('');
    const [dealerDeck, setDealerDeck] = useState([]);
    const [myDeck, setMyDeck] = useState([]);
    const [fetchedDeck, setFetchedDeck] = useState(false);
    const [flipCard, setFlipCard] = useState(false);
    const [dealerScore, setDealerScore] = useState(0);
    const [playerScore, setPlayerScore] = useState(0);
    const [bet, setBet] = useState();
    const [isBetting, setIsBetting] = useState(true);
    const [isStanding, setIsStanding] = useState(false);
    const [isSplit, setIsSplit] = useState(false);
    const [splitDeck, setSplitDeck] = useState([]);
    const [lost, setLost] = useState(false);
    const [win, setWin] = useState(false);
    const [aceArray, setAceArray] = useState(Array(11).fill(0));
    const [dealerAceArray, setDealerAceArray] = useState(Array(11).fill(0));
    const [showAlert, setShowAlert] = useState(false);
    const [doneStanding, setDoneStanding] = useState(false);
    const [tie, setTie] = useState(false);
    const [roundCount, setRoundCount] = useState(0);
    const [canSplit, setCanSplit] = useState(false);
    const [splitAceArray, setSplitAceArray] = useState(Array(11).fill(0));
    const [splitScore, setSplitScore] = useState(0);
    const [splitLost, setSplitLost] = useState(false);
    const [showSplitAlert, setShowSplitAlert] = useState(false);
    const [splitWin, setSplitWin] = useState(false);
    const [splitTie, setSplitTie] = useState(false);
    const [blackJack, setBlackJack] = useState(false);
    const [splitBlackJack, setSplitBlackJack] = useState(false);
    const [highscore, setHighscore] = useState(0);
    const {userInfo} = useContext(UserContext);

    useEffect(()=>{
        if (userInfo !== null){
            fetch(`${address}/user/${userInfo.username}/highscore`, {
                credentials: "include"
            })
            .then(response=>{
                response.json().then(highscore=>{
                    setHighscore(highscore);
                })
            })
        }
    },[money]);

    useEffect(()=>{
        if (userInfo !== null && money > highscore){
            fetch(`${address}/user/${userInfo.username}/highscore?money=${money}`, {
                credentials: "include",
                method: 'POST',
            });
        }
    },[placeOtherBet]);

    useEffect(()=>{
        if (startGame){
            start();
        }
    },[startGame,fetchedDeck]);

    //hook to check if player busted
    useEffect(()=>{
        if (myDeck.length>2){
            checkBust();
        }
    }, [myDeck]);

    useEffect(()=>{
        if (splitDeck.length>2){
            checkSplitBust();
        }
    },[splitDeck]);

    useEffect(()=>{
        if (win && !isSplit){
            if (blackJack){
                setMoney(money + 2.5*bet);
            } else{
                setMoney(money + 2*bet);
            }
        }
        if (win && isSplit){
            if (blackJack){
                setMoney(money + bet*3/2);
            }else{
                setMoney(money + bet);
            }
        }
    },[win]);

    useEffect(()=>{
        if (splitWin){
            if (splitBlackJack){
                setMoney(money + bet*3/2);
            }else{
                setMoney(money + bet);
            }
        }
    },[splitWin]);

    useEffect(()=>{
        if (tie && !isSplit){
            setMoney(money + bet);
        }
        if (tie && isSplit){
            setMoney(money + bet/2);
        }
    },[tie]);

    //hook to handle loss, allows card to render after losing
    useEffect(() => {
        if (lost) {
            setShowAlert(true);
        }
    }, [lost]);

    useEffect(()=>{
        if (splitLost){
            setShowSplitAlert(true);
        }
    }, [splitLost]);

    useEffect(()=>{
        //checkDealerAces();
        if (doneStanding && !isSplit){
            if (dealerScore > 21){
                setWin(true);
            }
            if (dealerScore > playerScore && dealerScore < 22){
                setShowAlert(true);
            } else if (playerScore > dealerScore){
                setWin(true);
            }else if (dealerScore == playerScore) {
                if (!blackJack){
                    setTie(true);
                }
            }
        }
        if (doneStanding && isSplit){
            if (dealerScore > 21){
                if (playerScore < 22){
                    setWin(true);
                }
                if (splitScore < 22){
                    setSplitWin(true);
                }
            }
            if (dealerScore > playerScore && dealerScore < 22){
                setShowAlert(true);
            }
            if (dealerScore > splitScore && dealerScore < 22){
                setShowSplitAlert(true);
            }
            if (playerScore > dealerScore && playerScore < 22){
                setWin(true);
            }
            if (splitScore > dealerScore && splitScore < 22){
                setSplitWin(true);
            }
            if (playerScore == dealerScore && playerScore < 22){
                if (!blackJack){
                    setTie(true);
                }
            }
            if (splitScore == dealerScore && splitScore < 22){
                if (!splitBlackJack){
                    setSplitTie(true);
                }
            }
        }
    }, [doneStanding]);

    const start = async ()=>{
        const response = await fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`);
        const deckresponse = await response.json();
        if (deckresponse){
            setDeck(deckresponse);
            setFetchedDeck(true);
        }
    }

    const hit = async ()=>{
        if (!isSplit) setCanSplit(false);
        if (!deck || isStanding) return;
        const newCard = await deal();
        if (newCard.cards){
            setMyDeck((prevDeck) => [...prevDeck, newCard.cards[0]]);
            const cardValue = calculateCardValue(newCard.cards[0].value);
            setPlayerScore(playerScore + cardValue);
            addAces();
            checkAces();
            checkBust();
        }
    }

    const splitHit = async ()=>{
        if (!deck || isStanding) return;
        const newCard = await deal();
        if (newCard.cards){
            setSplitDeck((prevDeck) => [...prevDeck, newCard.cards[0]]);
            const cardValue = calculateCardValue(newCard.cards[0].value);
            //change the bottom
            setSplitScore(splitScore + cardValue);
            addSplitAces();
            checkSplitAces();
            checkSplitBust();
        }
    }

    const split = ()=>{
        if (!deck) return;
        if (bet>money) return;
        setIsSplit(true);
        const card = myDeck[1];
        setSplitDeck((prevDeck)=> [...prevDeck, card]);
        const value = calculateCardValue(card.value);
        setSplitScore(value);
        const newArray = [...myDeck];
        newArray.splice(1,1);
        setMyDeck([...newArray]);
        const card1value = calculateCardValue(myDeck[0].value);
        setPlayerScore(card1value);
        setMoney(money-bet);
        setBet(2*bet);
    }

    const stand = async () =>{
        setFlipCard(true);
        setIsStanding(true);
        addDealerAces();
        let tempScore = dealerScore;
        if (tempScore > 21){
            if (checkDealerAces()){
                tempScore = tempScore - 10;
            }
        }
        let index = 2;
        while (tempScore < 17){
            await sleep();
            const newCard = await deal();
            setDealerDeck((prevDeck) => [...prevDeck, newCard.cards[0]]);
            const cardValue = calculateCardValue(newCard.cards[0].value);
            if (cardValue === 11){
                dealerAceArray[index] = 1;
            }
            tempScore = tempScore + cardValue;
            if (tempScore > 21){
                if (checkDealerAces()){
                    tempScore = tempScore-10;
                } else if (cardValue === 11){
                    dealerAceArray[index] = -1;
                    tempScore= tempScore-10;
                }
            }
            index++;
        }
        setDealerScore(tempScore);
        setDoneStanding(true);
    }

    const checkBust = ()=>{
        addAces();
        if (playerScore > 21 && !checkAces()){
            setLost(true);
        }
        if (playerScore === 21){
            setBlackJack(true);
            setWin(true);
        }
    }

    const checkSplitBust = ()=>{
        addSplitAces();
        if (splitScore > 21 && !checkSplitAces()){
            setSplitLost(true);
        }
        if (splitScore === 21){
            setSplitBlackJack(true);
            setSplitWin(true);
        }
    }

    const checkAces = ()=>{
        if (playerScore > 21){
            for (let i=0; i<myDeck.length; i++){
                if (aceArray[i]===1){
                    aceArray[i]=-1;
                    setPlayerScore(score => score -10);
                    return true;
                }
            }
        }
        return false;
    }

    const checkSplitAces = ()=>{
        if (splitScore > 21){
            for (let i=0; i<splitDeck.length; i++){
                if (splitAceArray[i]===1){
                    splitAceArray[i]=-1;
                    setSplitScore(score => score -10);
                    return true;
                }
            }
        }
        return false;
    }

    const checkDealerAces = ()=>{
            for (let i=0; i<dealerDeck.length; i++){
                if (dealerAceArray[i]===1){
                    dealerAceArray[i]=-1;
                    return true;
                }
            }
        return false;
    }

    const addAces = ()=>{
        myDeck.forEach((card, index)=>{
            if (card.value === 'ACE'){
                if (aceArray[index] === 0){
                    aceArray[index]= 1;
                }
            }
        })
    }

    const addSplitAces = ()=>{
        splitDeck.forEach((card, index)=>{
            if (card.value === 'ACE'){
                if (splitAceArray[index] === 0){
                    splitAceArray[index]= 1;
                }
            }
        })
    }

    const addDealerAces = ()=>{
        dealerDeck.forEach((card, index)=>{
            if (card.value === 'ACE'){
                if (dealerAceArray[index]===0){
                    dealerAceArray[index]= 1;
                }
            }
        })
    }

    const dealerStart = async ()=>{
        if (!deck) return;
        var cards = await deal(2);
        
        var cardValue = 0;
        cards.cards.forEach(card => {
            cardValue = cardValue + calculateCardValue(card.value);
        });
        while (cardValue === 21){
            cards = await deal(2);
            cardValue = 0;
            cards.cards.forEach(card => {
                cardValue = cardValue + calculateCardValue(card.value);
            });
        }
        setDealerDeck(cards.cards);
        setDealerScore(cardValue);
        addDealerAces();
        checkDealerAces();
    }

    const playerStart = async ()=>{
        if (!deck) return;
        const cards = await deal(2);

        /* const cards = { //temporary test for splitting
            "success": true, 
            "deck_id": "kxozasf3edqu", 
            "cards": [
                {
                    "code": "KH", 
                    "image": "https://deckofcardsapi.com/static/img/KH.png", 
                    "images": {
                                  "svg": "https://deckofcardsapi.com/static/img/KH.svg", 
                                  "png": "https://deckofcardsapi.com/static/img/KH.png"
                              }, 
                    "value": "KING", 
                    "suit": "HEARTS"
                }, 
                {
                    "code": "KS", 
                    "image": "https://deckofcardsapi.com/static/img/KS.png", 
                    "images": {
                                  "svg": "https://deckofcardsapi.com/static/img/KS.svg", 
                                  "png": "https://deckofcardsapi.com/static/img/KS.png"
                              }, 
                    "value": "KING", 
                    "suit": "SPADES"
                }
            ], 
            "remaining": 50
        } //end test */

        setMyDeck(cards.cards);
        var cardValue = 0;
        cards.cards.forEach(card => {
            cardValue = cardValue + calculateCardValue(card.value);
        });
        if (cards.cards[0].value === cards.cards[1].value){
            setCanSplit(true);
        }
        setPlayerScore(cardValue);
        addAces();
        checkAces();
        if (cardValue ===21){
            setBlackJack(true);
            setWin(true);
        }
    }

    const calculateCardValue = (cardValue) => {
        switch (cardValue) {
            case 'JACK':
            case 'QUEEN':
            case 'KING':
                return 10;
            case 'ACE':
                return 11;
            default:
                return parseInt(cardValue);
        }
    }

    const deal = async (number = 1)=>{
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${number}`);
        const cards = await response.json();
        return cards;
    }

    function sleep(time=1000){
        return new Promise(res=>{
            setTimeout(res,time)
        })
    }

    function placeBet(value){
        if (value <= money && value > 0){
            setMoney(money-value);
            setBet(value);
            dealerStart();
            playerStart();
            setIsBetting(false);
        }
    }

    async function placeOtherBet(value){
        if (value>money && money !== 0) return;
        setRoundCount(count => count + 1);
        if (roundCount%7===0){
            await fetch(`https://www.deckofcardsapi.com/api/deck/${deck.deck_id}/return/`);
            await fetch(`https://www.deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`);
        }
        //reset all variables for next round, except for money and deck, etc
        setMyDeck([]);
        setDealerDeck([]);
        setFlipCard(false);
        setDealerScore(0);
        setPlayerScore(0);
        setIsStanding(false);
        setIsBetting(false);
        setLost(false);
        setWin(false);
        setAceArray(Array(11).fill(0));
        setDealerAceArray(Array(11).fill(0));
        setShowAlert(false);
        setDoneStanding(false);
        setTie(false);
        
        setIsSplit(false);
        setCanSplit(false);
        setSplitDeck([]);
        setSplitAceArray(Array(11).fill(0));
        setSplitScore(0);
        setSplitLost(false);
        setShowSplitAlert(false);
        setSplitWin(false);
        setSplitTie(false);
        setBlackJack(false);
        setSplitBlackJack(false);

        if (value <= money && value > 0){
            setMoney(money-value);
            setBet(value);
            dealerStart();
            playerStart();
            setIsBetting(false);
        }
        if (money === 0){
            alert('No money left');
            setMoney(1500);
            setBet(0);
            start();
            setIsBetting(true);
            setStartGame(false);
        }

    }

    return(
        <>
            <div>
                {startGame ? (
                    <>
                        {userInfo !== null && (
                            <h5>Highscore: {highscore}</h5>
                        )}
                        <h1>Your balance: {money}</h1>
                        <h2>Your bet: {bet}</h2>
                        <img className="card" src="https://deckofcardsapi.com/static/img/back.png" alt="" />
                        {isBetting ? (
                            <>
                            <h2>Place your bet</h2>
                            <input type="text" 
                                placeholder="Bet amount"
                                className="bettxt"
                                value={bet}
                                onChange={ev => {
                                    const newValue = ev.target.value;
                                    if (newValue !== ""){
                                        setBet(parseInt(newValue));
                                    } else{
                                        setBet(0);
                                    }
                                }}
                            />
                            <button className="betbtn" style={{marginTop:'5px'}} onClick={()=>placeBet(bet)}>Place bet</button>
                            </>
                        ) : (
                            <>
                            <div>
                                {/* Before the first player turn */}
                                {!flipCard && (
                                    <>
                                    <div>Dealer hand</div>
                                    {dealerDeck && dealerDeck.length > 0 && (
                                        <>
                                        <div>
                                            <img className="card" src="https://deckofcardsapi.com/static/img/back.png" alt="" />
                                            <img className="card" key={dealerDeck[1].code} src={dealerDeck[1].image} alt="" />
                                        </div>   
                                        </>
                                    )}
                                    </>
                                )}
                                {/* After the first player turn */}
                                {flipCard && (
                                    <>
                                    <div>Dealer hand</div>
                                    <div>
                                        {dealerDeck.map(card => (
                                            <img className="card" key={card.code} src={card.image} alt="" />
                                        ))}
                                    </div>
                                    </>
                                )}
                                <div>Player hand</div>
                                {myDeck && myDeck.length > 0 && myDeck.map(card => (
                                    <>
                                    <img className="card" key={card.code} src={card.image} alt="" />
                                    </>
                                ))}
                            </div>
                            <div>
                                {!isStanding && !showAlert && !win && (
                                    <button className="actionbtn" onClick={()=>hit()} disabled={isStanding}>Hit</button>
                                )}
                                {!showAlert && !doneStanding && !isSplit && !win && (
                                    <button className="actionbtn" onClick={()=>stand()}>Stand</button>
                                )}
                                {!showAlert && canSplit && !doneStanding && !isSplit && (
                                    <button className="actionbtn" onClick={()=>split()}>Split</button>
                                )}
                                <div>
                                    {showAlert && (
                                        <>
                                            <alert>You lost!</alert>
                                        </>
                                    )}
                                    {win && (
                                        <>
                                            <alert>You won!</alert>
                                        </>
                                    )}
                                    {blackJack && (
                                        <alert> Blackjack!</alert>
                                    )}
                                    {tie && (
                                        <>
                                            <alert>Tied!</alert>
                                        </>
                                    )}
                                </div>
                                {(doneStanding || lost || win) && !isSplit && (                                        <>
                                    <h2>Place your bet</h2>
                                    <input type="text" 
                                        className="bettxt"
                                        placeholder="Bet amount"
                                        value={bet}
                                        onChange={ev => {
                                            const newValue = ev.target.value;
                                            if (newValue !== ""){
                                                setBet(parseInt(newValue));
                                            } else{
                                                setBet(0);
                                            }
                                        }}
                                    />
                                    <button className="betbtn" style={{marginTop:'5px'}} onClick={()=>placeOtherBet(bet)}>Place bet</button>
                                    </>
                                )}
                            </div>
                            </>
                        )}
                        
                        
                        {isSplit && (
                            <>
                            {splitDeck && splitDeck.length > 0 && splitDeck.map(card => (
                                <>
                                <img className="card" key={card.code} src={card.image} alt="" />
                                </>
                            ))}
                            <div>
                                {!isStanding && !showSplitAlert && (
                                    <>
                                    <button className="actionbtn" onClick={()=>splitHit()} disabled={isStanding}>Hit</button>
                                    </>
                                )}
                            </div>
                            <div>
                                {showSplitAlert && (
                                    <>
                                    <alert>You lost!</alert>
                                    </>
                                )}
                                {splitWin && (
                                    <>
                                    <alert>You won!</alert>
                                    </>
                                )}
                                {splitBlackJack && (
                                    <alert> Blackjack!</alert>
                                )}
                                {splitTie && (
                                    <>
                                    <alert>Tied!</alert>
                                    </>
                                )}
                            </div>
                            {!(showAlert && showSplitAlert) && !doneStanding && (
                                <button className="actionbtn" onClick={()=>stand()}>Stand</button>
                            )}
                            </>
                        )}
                        
                        {isSplit && (doneStanding || (lost && splitLost)) && (                                        <>
                            <h2>Place your bet</h2>
                                <input type="text" 
                                    placeholder="Bet amount"
                                    className="bettxt"
                                    value={bet}
                                    onChange={ev => {
                                        const newValue = ev.target.value;
                                        if (newValue !== ""){
                                            setBet(parseInt(newValue));
                                        } else{
                                            setBet(0);
                                        }
                                    }}
                                />
                                <button className="betbtn" style={{marginTop:'5px'}} onClick={()=>placeOtherBet(bet)}>Place bet</button>
                                </>
                        )}
                    </>
                ) : (
                    <>
                    <button className="blackjackstart" onClick={()=>setStartGame(true)}>Start Game</button>
                    </>
                )}
            </div>
        </>
    );
}