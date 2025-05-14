import * as React from "react";
import "../App.css";
import Paper from "@mui/material/Paper";
import CancelIcon from "@mui/icons-material/Cancel";
import FlagIcon from "@mui/icons-material/Flag";
import { gameStatus } from "./App";

function TableCell(prm) {
  var cellValue = prm.boardVal[prm.x][prm.y];
  var cellAnsValue = prm.boardAnsVal[prm.x][prm.y];
  var flgOpen = prm.boardOpenFlg[prm.x][prm.y];
  var tmp_arrVal,
    tmp_arrFlg,
    tmp_arrAnsVal = [];

  /**
   * 1マス開く　再帰関数
   * @param {*} x
   * @param {*} y
   */
  const openCell = async (x, y) => {
    /**
     * 開くマスの妥当性チェック　補助関数
     * @param {*} x2
     * @param {*} y2
     * @returns 再帰するかどうか
     */
    const checkOpenCell = (x2, y2) => {
      var res = false;

      if (x2 >= 0 && x2 < tmp_arrAnsVal.length && y2 >= 0 && y2 < tmp_arrAnsVal[prm.x].length) {
        if (tmp_arrAnsVal[x2][y2] === "") {
          if (!tmp_arrFlg[x2][y2]) {
            res = true;
          }
        }

        tmp_arrFlg[x2][y2] = true;
        tmp_arrVal[x2][y2] = tmp_arrAnsVal[x2][y2];
      }

      return res;
    };

    tmp_arrFlg[x][y] = true;
    tmp_arrVal[x][y] = tmp_arrAnsVal[x][y];

    for (var a = x - 1; a <= x + 1; a++) {
      for (var b = y - 1; b <= y + 1; b++) {
        if (a === x && b === y) {
          continue;
        }

        if (checkOpenCell(a, b)) {
          await openCell(a, b);
        }
      }
    }
  };

  /**
   * マスを開いた時のチェック
   */
  const checkAnsValue = async () => {
    //ゲーム終了処理
    if (cellAnsValue === "B") {
      prm.setFlgGame(gameStatus.Complete);

      for (var x = 0; x < tmp_arrVal.length; x++) {
        for (var y = 0; y < tmp_arrVal[x].length; y++) {
          if (tmp_arrAnsVal[x][y] === "B" && !tmp_arrFlg[x][y]) {
            tmp_arrVal[x][y] = "B";
          }
        }
      }
    }

    //マスを連続して開く処理
    if (cellAnsValue === "") {
      await openCell(prm.x, prm.y);
    }
  };

  /**
   * マスクリック時
   * @param {*} e イベント
   * @param {*} isRight 右クリックかどうか
   * @returns
   */
  const changeCellValue = async (e, isRight) => {
    //右クリックのメニューを開かない設定
    e.preventDefault();

    if (flgOpen || prm.flgGame === gameStatus.Complete) {
      return;
    }

    tmp_arrVal = [...prm.boardVal];
    tmp_arrFlg = [...prm.boardOpenFlg];
    tmp_arrAnsVal = [...prm.boardAnsVal];

    if (isRight) {
      //右クリック時
      if (cellValue === "F") {
        tmp_arrVal[prm.x][prm.y] = "";
        prm.setBoardBombCount(prm.boardBombCount + 1);
      } else {
        tmp_arrVal[prm.x][prm.y] = "F";
        prm.setBoardBombCount(prm.boardBombCount - 1);
      }
    } else {
      //左クリック時
      if (cellValue === "F") {
        return;
      }

      //ゲーム開始処理
      if (prm.flgGame === gameStatus.UnComplete) {
        prm.setFlgGame(gameStatus.Now);
        while (true) {
          tmp_arrAnsVal = prm.generateGame();
          cellAnsValue = tmp_arrAnsVal[prm.x][prm.y];

          if (cellAnsValue === "") {
            prm.setBoardAnsVal(tmp_arrAnsVal);
            prm.setTime(0);
            break;
          }
        }
      }

      tmp_arrVal[prm.x][prm.y] = cellAnsValue;
      tmp_arrFlg[prm.x][prm.y] = true;

      await checkAnsValue();
    }

    prm.setBoardVal(tmp_arrVal);
    prm.setBoardOpenFlg(tmp_arrFlg);
  };

  /**
   * マスの背景色指定
   * @returns RGBコード
   */
  const getCellStyle = () => {
    if (flgOpen) {
      return {
        bgcolor: "white",
      };
    } else {
      return {
        bgcolor: "#FFFACD",
      };
    }
  };

  return (
    <Paper
      square
      variant="outlined"
      className="cell"
      sx={getCellStyle}
      onClick={(e) => changeCellValue(e, false)}
      onContextMenu={(e) => changeCellValue(e, true)}
    >
      {cellValue === "B" ? <CancelIcon></CancelIcon> : cellValue === "F" ? <FlagIcon></FlagIcon> : cellValue}
    </Paper>
  );
}

export default React.memo(TableCell);
