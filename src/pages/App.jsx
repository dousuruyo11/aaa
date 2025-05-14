import * as React from "react";
import "../App.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";

import TableCell from "./TableCell";
import TimeWatch from "./TimeWatch";
import ResultDialog from "./ResultDialog";

/**
 * ゲームの状態enum
 */
export const gameStatus = {
  UnComplete: 1,
  Now: 2,
  Complete: 3,
};

/**
 * 二次元配列を初期値埋めて生成
 * @param {*} val パディング初期値
 * @returns 二次元配列
 */
const generate2DArray = (val = 0) => {
  return [...Array(boardWidth)].map((_) => Array(boardHeight).fill(val));
};

/**
 * 二次元配列を見やすいようにprint
 * @param {*} arr 対象二次元配列
 */
const print2DArray = (arr) => {
  var str = "";

  for (var x = 0; x < boardWidth; x++) {
    for (var y = 0; y < boardHeight; y++) {
      if (!arr[x][y]) {
        str += "/ ";
      } else {
        str += arr[x][y] + " ";
      }
    }
    str += "\r\n";
  }

  console.log(str);
};

/**
 * ゲーム初期化
 * @returns 正解となるボードデータ
 */
const generateGame = () => {
  var boardAnsVal = generate2DArray("");

  //データ生成
  for (var i = 0; i < boardBomb; i++) {
    var x = Math.floor(Math.random() * boardWidth);
    var y = Math.floor(Math.random() * boardHeight);

    if (boardAnsVal[x][y] === "B") {
      i--;
    } else {
      boardAnsVal[x][y] = "B";
    }
  }

  for (x = 0; x < boardWidth; x++) {
    for (y = 0; y < boardHeight; y++) {
      if (boardAnsVal[x][y] === "B") {
        continue;
      }

      var count = 0;
      for (var j = x - 1; j < x + 2; j++) {
        if (j < 0 || j >= boardWidth) {
          continue;
        }
        for (var k = y - 1; k < y + 2; k++) {
          if (k < 0 || k >= boardHeight) {
            continue;
          }

          if (boardAnsVal[j][k] === "B") {
            count++;
          }
        }
      }

      if (count > 0) {
        boardAnsVal[x][y] = count;
      }
    }
  }

  print2DArray(boardAnsVal);
  return boardAnsVal;
};

//ボードの横幅・縦幅・ボム数（可変）
var boardWidth = 9;
var boardHeight = 9;
var boardBomb = 10;
var selectDiff = "初級";

const infoDifficulity = [
  { text: "初級", width: 9, height: 9, bomb: 10 },
  { text: "中級", width: 16, height: 16, bomb: 40 },
  { text: "上級", width: 16, height: 30, bomb: 90 },
];

function App() {
  const [boardAnsVal, setBoardAnsVal] = React.useState(generate2DArray(""));
  const [boardVal, setBoardVal] = React.useState(generate2DArray(""));
  const [boardOpenFlg, setBoardOpenFlg] = React.useState(generate2DArray(false));
  const [flgGame, setFlgGame] = React.useState(gameStatus.UnComplete);
  const [boardBombCount, setBoardBombCount] = React.useState(boardBomb);
  const [message, setMessage] = React.useState("GAME OVER");
  const [time, setTime] = React.useState(0);
  const [openResult, setOpenResult] = React.useState(false);

  /**
   * ボム数増減した際にゲームクリアしたか逐次チェック
   * @returns
   */
  const checkGameClear = () => {
    if (boardBombCount !== 0) {
      return;
    }

    for (var x = 0; x < boardWidth; x++) {
      for (var y = 0; y < boardHeight; y++) {
        if (boardVal[x][y] === "F" && boardAnsVal[x][y] !== "B") {
          return;
        }
      }
    }

    setFlgGame(gameStatus.Complete);
    setMessage("GAME CLEAR");
    setOpenResult(true);
  };

  /**
   * ゲーム初期化
   */
  const startGame = (info) => {
    boardWidth = info.width;
    boardHeight = info.height;
    boardBomb = info.bomb;
    selectDiff = info.text;

    setTime(0);
    setFlgGame(gameStatus.UnComplete);
    setMessage("GAME OVER");
    setBoardVal(generate2DArray(""));
    setBoardOpenFlg(generate2DArray(false));
    setBoardAnsVal(generate2DArray(""));
    setBoardBombCount(boardBomb);
  };

  /**
   * ボム数増減時
   */
  React.useEffect(() => {
    checkGameClear();
  }, [boardBombCount]);

  return (
    <Box sx={{ flexGrow: 1 }} className="App">
      <Grid container>
        <Grid item md={12} className="base-center">
          <TimeWatch time={time} setTime={setTime} flgGame={flgGame}></TimeWatch>
        </Grid>
        <Grid item md={12} className="base-center">
          <Stack direction="row" spacing={2}>
            {infoDifficulity.map((info) => (
              <Button
                variant="outlined"
                size="large"
                key={info.text}
                onClick={() => {
                  startGame(info);
                }}
              >
                {info.text}
              </Button>
            ))}
          </Stack>
        </Grid>
        <Grid item md={3} className="base-center">
          {flgGame === gameStatus.Complete && <div style={{ color: "red" }}>{message}</div>}
        </Grid>
        <Grid item md={6}></Grid>
        <Grid item md={3} className="base-center">
          <div>残：{boardBombCount}</div>
        </Grid>
        <Grid item md={12}>
          <Box className="base-center">
            {[...Array(boardWidth)].map((_, x) => (
              <div style={{ display: "flex" }} key={x}>
                {[...Array(boardHeight)].map((_, y) => (
                  <TableCell
                    boardVal={boardVal}
                    setBoardVal={setBoardVal}
                    boardOpenFlg={boardOpenFlg}
                    setBoardOpenFlg={setBoardOpenFlg}
                    flgGame={flgGame}
                    setFlgGame={setFlgGame}
                    boardAnsVal={boardAnsVal}
                    setBoardAnsVal={setBoardAnsVal}
                    boardBombCount={boardBombCount}
                    setBoardBombCount={setBoardBombCount}
                    setTime={setTime}
                    checkGameClear={checkGameClear}
                    generateGame={generateGame}
                    x={x}
                    y={y}
                    key={x + "" + y}
                  ></TableCell>
                ))}
              </div>
            ))}
          </Box>
        </Grid>
      </Grid>
      <ResultDialog
        difficulity={selectDiff}
        time={time}
        openResult={openResult}
        setOpenResult={setOpenResult}
      ></ResultDialog>
    </Box>
  );
}

export default React.memo(App);
