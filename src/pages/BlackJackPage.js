import { useEffect, useState } from "react";

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
    const [roundOver, setRoundOver] = useState(false);
    const [isSplit, setIsSplit] = useState(false);
    const [splitDeck, setSplitDeck] = useState([]);
    const [isQuit, setIsQuit] = useState(false);
    const [lost, setLost] = useState(false);
    const [win, setWin] = useState(false);
    const [aceArray, setAceArray] = useState(Array(11).fill(0));
    const [dealerAceArray, setDealerAceArray] = useState(Array(11).fill(0));
    const [showAlert, setShowAlert] = useState(false);
    const [doneStanding, setDoneStanding] = useState(false);
    const [tie, setTie] = useState(false);
    const [roundCount, setRoundCount] = useState(0);
    const [isShuffling, setIsShuffling] = useState(false);

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
        if (dealerDeck.length>=2){
            checkDealerBust();
        }
    }, [dealerDeck]);

    useEffect(()=>{
        if (win){
            setMoney(money + 2*bet);
        }
    },[win]);

    useEffect(()=>{
        if (tie){
            setMoney(money + bet);
        }
    },[tie]);

    //hook to handle loss, allows card to render after losing
    useEffect(() => {
        if (lost) {
          setShowAlert(true);
        }
      }, [lost]);

    useEffect(()=>{
        if (doneStanding){
            if (dealerScore > 21){
                setWin(true);
            } else if (dealerScore > playerScore){
                setShowAlert(true);
            } else if (playerScore > dealerScore){
                setWin(true);
            } else {
                setTie(true);
            }
        }
    }, [doneStanding]) //doneStanding

    const start = async ()=>{
        const response = await fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`);
        const deckresponse = await response.json();
        if (deckresponse){
            setDeck(deckresponse);
            setFetchedDeck(true);
        }
    }

    const hit = async ()=>{
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

    const stand = async ()=>{
        setFlipCard(true);
        setIsStanding(true);
        let isBust = false;
        while (!isBust && dealerScore < 17){
            const newCard = await deal();
            setDealerDeck((prevDeck) => [...prevDeck, newCard.cards[0]]);
            const cardValue = calculateCardValue(newCard.cards[0].value);
            setDealerScore(score => score + cardValue);
            addDealerAces();
            isBust = dealerScore + cardValue >= 17 && !checkDealerAces();
            if (dealerScore >= 17){
                break;
            }
            if (!isBust){
                break;
            }
        }
        setDoneStanding(true);
    }

    const checkBust = ()=>{
        addAces();
        if (playerScore > 21 && !checkAces()){
            setLost(true);
            setRoundOver(true);
        }
    }

    const checkDealerBust = ()=>{
        addDealerAces();
        if (dealerScore > 21){
            if (!checkDealerAces()){
                setRoundOver(true);
            }
        } else if (doneStanding){
            setDoneStanding(false);
            stand();
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

    const checkDealerAces = ()=>{
        if (dealerScore > 21){
            for (let i=0; i<dealerDeck.length; i++){
                if (dealerAceArray[i]===1){
                    dealerAceArray[i]=-1;
                    setDealerScore(score => score -10);
                    return true;
                }
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
        const cards = await deal(2);
        setDealerDeck(cards.cards);
        var cardValue = 0;
        cards.cards.forEach(card => {
            cardValue = cardValue + calculateCardValue(card.value);
        });
        setDealerScore(cardValue);
        addDealerAces();
        checkDealerAces();
    }

    const playerStart = async ()=>{
        if (!deck) return;
        const cards = await deal(2);
        setMyDeck(cards.cards);
        var cardValue = 0;
        cards.cards.forEach(card => {
            cardValue = cardValue + calculateCardValue(card.value);
        });
        setPlayerScore(cardValue);
        addAces();
        checkAces();
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

    function placeBet(value){
        if (value < money && value > 0){
            setMoney(money-value);
            setBet(value);
            dealerStart();
            playerStart();
            setIsBetting(false);
        }
    }

    async function placeOtherBet(value){
        if (money === 0){
            alert('No money left');
            setMoney(1500);
        }
        setRoundCount(count => count + 1);
        if (roundCount%7===0){
            setIsShuffling(true);
            await fetch(`https://www.deckofcardsapi.com/api/deck/${deck.deck_id}/return/`);
            await fetch(`https://www.deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`);
            setIsShuffling(false);
        }
        if (win){
            setMoney(money+ 2*bet);
        }
        setFlipCard(false);
        setDealerScore(0);
        setPlayerScore(0);
        setIsStanding(false);
        setIsBetting(false);
        setRoundOver(false);
        setLost(false);
        setWin(false);
        setAceArray(Array(11).fill(0));
        setDealerAceArray(Array(11).fill(0));
        setShowAlert(false);
        setDoneStanding(false);
        setTie(false);
        if (value <= money && value > 0){
            setMoney(money-value);
            setBet(value);
            dealerStart();
            playerStart();
            setIsBetting(false);
        }
    }

    return(
        <>
            <div>
                {startGame ? (
                    <>
                        <h1>Your balance: {money}</h1>
                        <h2>Your bet: {bet}</h2>
                        <img className="card" src="https://deckofcardsapi.com/static/img/back.png" alt="" />
                        {isBetting ? (
                            <>
                            <h2>Place your bet</h2>
                            <input type="text" 
                                placeholder="Bet amount"
                                value={bet}
                                onChange={ev => setBet(parseInt(ev.target.value))}
                            />
                            <button id="createbtn" style={{marginTop:'5px'}} onClick={()=>placeBet(bet)}>Place bet</button>
                            </>
                        ) : (
                            <>
                                <div>
                                    {/* Before the first player turn */}
                                    {!flipCard && (
                                        <>
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
                                        <div>
                                            {dealerDeck.map(card => (
                                                <img className="card" key={card.code} src={card.image} alt="" />
                                            ))}
                                        </div>
                                        
                                        </>
                                    )}
                                    
                                    {myDeck && myDeck.length > 0 && myDeck.map(card => (
                                        <>
                                        <img className="card" key={card.code} src={card.image} alt="" />
                                        </>
                                    ))}
                                </div>
                                <div>
                                    {!isStanding && !showAlert && (
                                        <button onClick={()=>hit()} disabled={isStanding}>Hit</button>
                                    )}
                                    {!showAlert && !doneStanding && (
                                        <button onClick={()=>stand()}>Stand</button>
                                    )}
                                    {(doneStanding || lost) && (
                                        <>
                                        <h2>Place your bet</h2>
                                        <input type="text" 
                                            placeholder="Bet amount"
                                            value={bet}
                                            onChange={ev => setBet(parseInt(ev.target.value))}
                                        />
                                        <button id="createbtn" style={{marginTop:'5px'}} onClick={()=>placeOtherBet(bet)}>Place bet</button>
                                        </>
                                    )}
                                    
                                </div>
                                
                            </>
                        )}
                        {showAlert && (
                            <>
                                <alert>You Lost!</alert>
                            </>
                            
                        )}
                        {win && (
                            <>
                                <alert>You won!</alert>
                            </>
                        )}
                        {tie && (
                            <>
                                <alert>Tied!</alert>
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