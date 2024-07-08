# Intersection Observer API

[Tutorial: Build an infinite scrolling list of pokemons](https://reactpractice.dev/solution/tutorial-build-an-infinite-scrolling-list-of-pokemons/)

## スクロールで次ぎのページを読み込む

ユーザーがページの最後に到達したことを検知するために、Intersection Observer API を使うことができる。

この 2 つがあれば OK。

- ページの終わり、を表す要素（ポケモンのリストの直後の空の div）。
- ページの終わり、がビューポートと交差するのを追跡できる Intersection Oberser。

```tsx
const endOfPageRef = useRef();
...
return (
  <div>
      ...
     <div ref={endOfPageRef}></div>
  </div>
);
```

observer を作成。これはサイドエフェクトであり、コンポーネントのマウント時のみの作成をしたい。

ひとつ注意点。スクロールする前から「交差している」と表示されてしまう。
これは、observer.observe でオブサーバーを登録すると、初期化時にオーバーラップの状態をチェックするためにコールバックが呼び出されるため。

初期のポケモンリストがまだ読み込まれていないため「ページの終わり」の div が表示され、要素が交差していると判断されてしまうのだ。

この問題を回避するために、endOfPage が交差しているかどうかだけでなく、ページがロード中の状態ではないかどうかもチェックすることができる。

```tsx
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    // entriesには、「監視対象」の各要素に対して1つのエントリが含まれます
    const endOfPage = entries[0];
    if (endOfPage.isIntersecting && !isPending) {
      console.log("is intersecting");
    } else {
      console.log("is not intersecting");
    }
  });
  observer.observe(endOfPageRef.current!);
}, [isPending]);
```

`isPending` が変更されるたびにオブサーバーが作成されてしまう。
代わりに、交差コールバック用の ref を使用し、それを毎回のレンダリングで更新されるハンドラーを指すようにする。
