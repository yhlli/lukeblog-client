import { useEffect, useState } from "react";
import Loading from "../Loading";

export default function BlackJack(){
    const [startGame, setStartGame] = useState(false);
    const [money, setMoney] = useState(1500);
    const [deck, setDeck] = useState('');
    const [isLoading, setIsLoading] = useState(true);
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

    useEffect(()=>{
        if (startGame){
            start();
            setIsLoading(false);
        }
    },[startGame,fetchedDeck]);

    //hook to check if player busted
    useEffect(()=>{
        if (myDeck.length>2){
            checkBust();
        }
    }, [myDeck]);

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
    }, [doneStanding])

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
            if (newCard.cards){
                setDealerDeck((prevDeck) => [...prevDeck, newCard.cards[0]]);
                const cardValue = calculateCardValue(newCard.cards[0].value);
                addDealerAces();
                isBust = dealerScore + cardValue >= 17 && !checkDealerAces();
                setDealerScore(score => score + cardValue);
                console.log(dealerScore)
                if (dealerScore >= 17) break;
            }
        }
        setDoneStanding(true);
    }

    const checkBust = ()=>{
        if (playerScore > 21 && !checkAces()){
            setLost(true);
            setRoundOver(true);
        }
    }

    const checkAces = ()=>{
        for (let i=myDeck.length-1; i>=0; i--){
            if (aceArray[i]===1 && playerScore > 21){
                aceArray[i]=-1;
                setPlayerScore(score => score -10);
                return true;
            }
        }
        return false;
    }

    const checkDealerAces = ()=>{
        for (let i=dealerDeck.length-1; i>=0; i--){
            if (dealerAceArray[i]===1 && dealerScore > 21){
                dealerAceArray[i]=-1;
                setDealerScore(score => score -10);
                break;
            }
        }
    }

    const addAces = ()=>{
        for (let i= 0; i<myDeck.length; i++){
            if (myDeck[i].value === 'ACE'){
                if (aceArray[i]=== 0){
                    aceArray[i] = 1;
                }
            }
        }
    }

    const addDealerAces = ()=>{
        for (let i= 0; i<dealerDeck.length; i++){
            if (dealerDeck[i].value === 'ACE'){
                if (dealerAceArray[i]!== -1)
                dealerAceArray[i] = 1;
            }
        }
    }

    const dealerStart = async ()=>{
        if (!deck) return;
        const cards = await deal(2);
        if (cards.cards){
            setDealerDeck(cards.cards);
            var cardValue = 0;
            cards.cards.forEach(card => {
                cardValue = cardValue + calculateCardValue(card.value);
            });
            setDealerScore(cardValue);
            addAces();
        }
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

    function placeOtherBet(value){
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
        if (value < money && value > 0){
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
                {startGame && (
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
                                    {doneStanding && (
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
                    </>
                )}
            </div>
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

            {!startGame && (
                <button className="blackjackstart" onClick={()=>setStartGame(true)}>Start Game</button>
            )}
        </>
    );
}