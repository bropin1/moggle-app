import { forwardRef } from "react";
import { ReactComponent as TrashSvg } from "../../ressources/images/trash-can.svg";
import styles from "./trash.module.scss";

const Trash = forwardRef((props, ref) => {
  return (
    <div className={styles.root} ref={ref}>
      <TrashSvg className={styles.svg} />
    </div>
  );
});
export default Trash;
