import { useState } from 'react';
import styles from './index.module.css';
const directions = [
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];
const Home = () => {
  // bombの位置を更新し、記憶する関数、useState
  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [userInput, setUserInput] = useState([
    //右クリックしたときの表示の順番 旗 -> ？ -> 表示なし -> 旗 -> ？ -> 表示なしをクリックする
    //0:何もしていない 1:左クリックするとcellが開く 2:右クリック 旗 3:右クリック ?

    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const board = userInput.map((aArray, y) => {
    return aArray.map((value, x) => {
      return {
        value,
        isOpend: value === 4,
        hasUserInput: () => value !== 0,
        isBomb: bombMap[y][x] >= 1,
      };
    });
  });

  const getRandomInt = (min: number, max: number) => {
    // Math.random()は0以上1未満の値を返すため、適切な範囲に変換する
    //min~max間の整数を返す関数を設定
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const defaultBombSeries = (bombMap: number[][]) => {
    return bombMap.flat();
  };
  const defaultBombCounts = (bombMap: number[][]) => {
    return defaultBombSeries(bombMap).filter((bomb) => bomb === 11).length;
  };

  // cellをクリックした際に生成されたbombを一時的に記憶する関数
  const plotBomb = (x: number, y: number, bombMap: number[][]) => {
    let bombX = getRandomInt(0, 8);

    let bombY = getRandomInt(0, 8);

    while (defaultBombCounts(bombMap) < 10) {
      bombX = getRandomInt(0, 8);

      bombY = getRandomInt(0, 8);

      if (defaultBombCounts(bombMap) === 10) {
        break;
      }
      // 被っていれば変更なしで返す
      if (bombX === x && bombY === y) {
        continue;
      }
      //そうでなければ爆弾をランダムにプロットする
      else {
        //cellに何もない & タップした場所以外である時にplot可能
        if (bombMap[bombY][bombX] === 0) {
          bombMap[bombY][bombX] = 11;
          // 乱数を新しく生成
        } else {
          continue;
        }
      }
    }

    return bombMap;
  };

  //cellをクリックした際の挙動の関数
  const clickHandler = (x: number, y: number) => {
    userInput[y][x] = 1;
    //bombMap本体をいじるのはご法度、ゆえにクローンをして、それをいじる。
    const newMap = structuredClone(bombMap);

    const newPlotBomb = plotBomb(x, y, newMap);

    // const bombCounter = ()=>{
    //   const toFlat = newPlotBomb.flat();
    //   toFlat.filter((cellNum)=>cellNum === 11)
    // }

    setBombMap(newPlotBomb);

    emptyChainReaction(x, y, [], userInput);
  };

  //bomb生成 数字生成
  //タップした場所から八方向を確認した
  const emptyChainReaction = (
    x: number,
    y: number,
    zeroCellCheck: string[],
    userInput: number[][],
  ) => {
    const newInput = structuredClone(userInput);
    //範囲外の場合はじく
    if ((!(0 < x && x < 9) && !(0 < y && y < 9)) || bombMap[y] === undefined) {
      return;
    }

    //既に再帰したセルの座標外す
    if (zeroCellCheck.includes(`${y}-${x}`)) {
      return;
    }
    //今見ているcellの座標を控える、再帰した座標を控える
    zeroCellCheck.push(`${y}-${x}`);

    // その座標に爆弾がない
    //bombMapにbomb生成と同時にcell周囲のbombの数を表示（置き換える）
    if (bombMap[y] !== undefined && bombMap[y][x] === 0) {
      let bombCounter = 0;
      for (const direction of directions) {
        if (
          bombMap[y + direction[0]] !== undefined &&
          bombMap[y + direction[0]][x + direction[1]] === 11
        ) {
          bombCounter += 1;
        }
      }
      bombMap[y][x] = bombCounter;
      console.log(bombMap[y][x]);
    }
    //タップしたセルが０以外
    if (bombMap[y] !== undefined && bombMap[y][x] !== 0) {
      userInput[y][x] = 1;

      return newInput;
    }

    // 爆弾が周囲にない場合、周辺セルを開示（再帰開始）
    for (const direction of directions) {
      if (
        bombMap[y + direction[0]] !== undefined &&
        bombMap[y + direction[0]][x + direction[1]] !== 0
      ) {
        emptyChainReaction(x + direction[0], y + direction[1], zeroCellCheck, userInput);
      }
    }
    return setUserInput(newInput);
  };

  //userInput,bombMapの数値をboardに代入
  // for (let y = 0; y < 9; y++) {
  //   for (let x = 0; x < 9; x++) {
  //     //boardにbombを配置（置き換える）
  //     if (bombMap[y][x] === 11) {
  //       board[y][x] = 11;
  //     }
  //     if (1 <= bombMap[y][x] && bombMap[y][x] <= 8) {
  //       board[y][x] = bombMap[y][x];
  //     }
  //   }
  // }

  return (
    <div className={styles.container}>
      <div className={styles.boardStyle}>
        {board.map((row, y) =>
          row.map((spot, x) => (
            //x,yそれぞれ0~8の中から一つずつ選びそれをsetBombMapに代入、しかしuserInputしていないところのみ

            <div
              className={styles.cellStyle}
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y)}
              //クリックしたuserInputの座標に-1を代入し、spot=== -1の時visibility: `hidden` にするようにする
              style={{ visibility: userInput[y][x] === 1 ? `hidden` : `visible` }}
            >
              {/* {if(spot=== 0){
                  <div className={styles.tapPosStyle} style={{backgroundPosition: `${-30 * tapPos}px, 0px`}}></div>
                }
                } */}
            </div>
          )),
        )}
      </div>
      <div className={styles.boardStyle2}>
        {board.map((row, y) =>
          row.map((spot, x) => (
            <div
              className={styles.innerStyle}
              key={`${x}-${y}`}
              style={{
                backgroundColor: userInput[y][x] === 1 ? '#94adda' : 'rgb(204 202 202 / 80%)',
              }}
            >
              <div
                className={styles.imageStyle}
                style={{ backgroundPosition: `${-30 * (spot - 1)}px, 0px` }}
              />
            </div>
          )),
        )}
      </div>
      {/* <div className={styles.sampleStyle} style={{ backgroundPosition: `${-30 * 2}px, 0px` }} /> */}
    </div>
  );
};
export default Home;
