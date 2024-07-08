import { useEffect, useState, useRef } from "react";

const PAGE_SIZE = 12;

const fetchPokemonPage = async (offset = 0) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
  );
  const data = await response.json();
  return data.results;
};

const PokemonsList = () => {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [isPending, setIsPending] = useState(false);

  const endOfPageRef = useRef<HTMLDivElement>(null);
  const intersectionCallback = useRef<
    (entries: IntersectionObserverEntry[]) => void
  >(() => {});

  useEffect(() => {
    setIsPending(true);
    fetchPokemonPage().then((firstPageOfPokemons) => {
      setPokemons(firstPageOfPokemons);
      setIsPending(false);
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) =>
      intersectionCallback.current(entries)
    );
    observer.observe(endOfPageRef.current!);
  }, []);

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    const endOfPage = entries[0];
    if (endOfPage.isIntersecting && !isPending) {
      setIsPending(true);
      fetchPokemonPage(pokemons.length).then((newPageOfPokemons) => {
        setPokemons([...pokemons, ...newPageOfPokemons]);
        setIsPending(false);
      });
    } else {
      console.log("is not intersecting");
    }
  };

  useEffect(() => {
    intersectionCallback.current = handleIntersection;
  });

  // useEffect(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     // entriesには、「監視対象」の各要素に対して1つのエントリが含まれます
  //     const endOfPage = entries[0];
  //     if (endOfPage.isIntersecting && !isPending) {
  //       console.log("is intersecting");
  //     } else {
  //       console.log("is not intersecting");
  //     }
  //   });
  //   observer.observe(endOfPageRef.current!);
  // }, [isPending]);

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 250px)",
          margin: "auto",
          maxWidth: "1000px",
        }}
      >
        {pokemons.map((pokemon: any) => (
          <div
            key={pokemon.name}
            style={{
              border: "1px solid lightgray",
              padding: "5px",
              margin: "5px",
              textAlign: "center",
            }}
          >
            <h3>{pokemon.name}</h3>
            <img
              src={`https://img.pokemondb.net/artwork/${pokemon.name}.jpg`}
              width={`200px`}
              alt=""
            />
          </div>
        ))}
        {isPending && (
          <div
            style={{
              textAlign: "center",
              margin: "10px",
            }}
          >
            Loading...
          </div>
        )}
        <div ref={endOfPageRef} />
      </div>
    </div>
  );
};

export default PokemonsList;
