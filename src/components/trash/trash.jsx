import { forwardRef } from "react";
import trashImg from "../../ressources/images/trash-can.png";
import styles from "./trash.module.scss";

const Trash = forwardRef((props, ref) => {
  return (
    <div className={styles.root} ref={ref}>
      <img src={trashImg} draggable={false} alt="" />;
    </div>
  );
});
export default Trash;
