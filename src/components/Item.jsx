import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { itemStatus } from "../utils/itemStatus";
import { formatTime, formatMoney } from "../utils/formatString";
import { ModalsContext } from "../contexts/ModalsProvider";
import { ModalTypes } from "../utils/modalTypes";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

export const Item = ({ item }) => {
  const { openModal } = useContext(ModalsContext);

  const [primaryImageSrc, setPrimaryImageSrc] = useState("");
  const [bids, setBids] = useState(0);
  const [winner, setWinner] = useState("");
  const [amount, setAmount] = useState(item.startingPrice);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const status = itemStatus(item);
    setBids(status.bids);
    if (status.winner) {
      getDoc(doc(db, "users", status.winner)).then((user) => {
        setWinner(user.get("name"));
      });
    } else {
      setWinner("");
    }
    setAmount(formatMoney(item.currency, status.amount));
  }, [item]);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = item.endTime - now;

      if (remaining > 0) {
        setTimeLeft(formatTime(remaining));
        requestAnimationFrame(updateTimer);
      } else {
        setTimeLeft("Item Ended");
      }
    };

    requestAnimationFrame(updateTimer);
  }, [item.endTime]);

  useEffect(() => {
    import(`../assets/${item.primaryImage}.png`).then((src) => {
      setPrimaryImageSrc(src.default)
    })
  }, [item.primaryImage])

  return (
    <div className="col">
      <div className="card h-100" onClick={() => openModal(ModalTypes.ITEM, item)}>
        <img
          src={primaryImageSrc}
          className="card-img-top"
          alt={item.title}
        />
        <div className="card-body d-flex justify-content-between align-items-center" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
         <div>
          <h5 className="title">{item.title}</h5>
           <h6 className="card-subtitle mb-2 text-body-secondary">{item.subtitle}</h6>
            </div>
            {winner && (
            <div className="text-success d-flex align-items-center">
            <span className="me-1">{winner}</span>
            <i className="bi bi-arrow-up"></i> {/* Bootstrap green upward arrow */}
          </div>
            )}
      </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item"><strong> {amount}</strong></li>
          <li className="list-group-item">{bids} bids · {timeLeft}</li>
        </ul>
      </div>
    </div>
  );
};

Item.propTypes = {
  item: PropTypes.shape({
    startingPrice: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    endTime: PropTypes.object.isRequired,
    primaryImage: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
  })
}
