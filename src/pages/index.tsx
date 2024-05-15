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
    // 被っていっれば変更なしで返す
    if (bombX === x && bombY === y) {
      continue;
    }
    //そうでなければ爆弾を連ダムにプロットする
    else {
      //cellに何もない & タップした場所以外である時にplot可能
      if (bombMap[y][x] === 0) {
        bombMap[bombY][bombX] = 11;
        // 乱数を新しく生成
        bombX = getRandomInt(0, 8);

        bombY = getRandomInt(0, 8);
      } else {
        continue;
      }
    }
  }

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      let bombCounter = 0;
      if (bombMap[y][x] === 0) {
        for (const direction of directions) {
          {
            if (
              bombMap[y + direction[0]] !== undefined &&
              bombMap[y + direction[0]][x + direction[1]] === 11
            ) {
              bombCounter += 1;

              //newPlotBomb[y][x] = 1
            }
          }
        }
        bombMap[y][x] = bombCounter;
      }
    }
  }

  return bombMap;
};

const Home = () => {
  const [tapPos, setTapPos] = useState(0);
  // bombの位置を更新し、記憶する関数、useState
  const [bombMap, setBombMap] = useState([
    [2, 0, 0, 0, 0, 0, 0, 0, 0],
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
  //cellをクリックした際の挙動の関数
  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    //bombMap本体をいじるのはご法度、ゆえにクローンをして、それをいじる。
    const newMap = structuredClone(bombMap);
    const newPlotBomb = plotBomb(x, y, newMap);

    // const bombCounter = ()=>{
    //   const toFlat = newPlotBomb.flat();
    //   toFlat.filter((cellNum)=>cellNum === 11)
    // }

    setBombMap(newPlotBomb);
  };

  return (
    <div className={styles.container}>
      <div className={styles.boardStyle}>
        {userInput.map((row, y) =>
          row.map((spot, x) => (
            //x,yそれぞれ0~8の中から一つずつ選びそれをsetBombMapに代入、しかしuserInputしていないところのみ

            <div
              className={styles.cellStyle}
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y)}
              //クリックした座標に１を代入し、spot=== 1の時visibility: `hidden` にするようにする
              // style={{ visibility: `hidden` }}
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
        {bombMap.map((row, y) =>
          row.map((spot, x) => (
            //x,yそれぞれ0~8の中から一つずつ選びそれをsetBombMapに代入、しかしuserInputしていないところのみ
            <div className={styles.innerStyle} key={`${x}-${y}`}>
              <div
                className={styles.sampleStyle}
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
