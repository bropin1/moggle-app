import { forwardRef } from "react";
import { ReactComponent as TrashSvg } from "../../ressources/images/trash-can.svg";
import styles from "./trash.module.scss";

const Trash = forwardRef(({ handleOnClickDelete }, ref) => {
  return (
    <div className={styles.root} ref={ref} onClick={handleOnClickDelete}>
      <TrashSvg className={styles.svg} />
    </div>
  );
});
export default Trash;
