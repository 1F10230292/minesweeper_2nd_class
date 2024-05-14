import { useState } from 'react';
import styles from './index.module.css';

const getRandomInt = (min: number, max: number) => {
  // Math.random()は0以上1未満の値を返すため、適切な範囲に変換する
  //min~max間の整数を返す関数を設定
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// cellをクリックした際に生成されたbombを一時的に記憶する関数
const plotBomb = (x: number, y: number, bombMap: number[][]) => {
  const bombX = getRandomInt(0, 8);

  const bombY = getRandomInt(0, 8);

  // 被っていっれば変更なしで返す
  if (bombX === x && bombY === y) {
    return bombMap;
  }
  //そうでなければ爆弾を連ダムにプロットする
  bombMap[bombY][bombX] = 11;
  return bombMap;
};
const Home = () => {
  const [samplePos, setSamplePos] = useState(0);
  console.log(samplePos);

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
    //bombMapをいじるのはご法度、ゆえにクローンをして、それをいじる。
    const newMap = structuredClone(bombMap);
    const newPlotBomb = plotBomb(x, y, newMap);
    setBombMap(newPlotBomb);
  };

  return (
    <div className={styles.container}>
      <div className={styles.boardStyle}>
        {userInput.map((row, y) =>
          row.map((spot, x) => (
            //x,yそれぞれ0~8の中から一つずつ選びそれをsetBombMapに代入、しかしuserInputしていないところのみ
            <div className={styles.cellStyle} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
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
