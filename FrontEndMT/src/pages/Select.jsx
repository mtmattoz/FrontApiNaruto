import './Select.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Select() {
    const navigate = useNavigate();
    const [personagens, setPersonagens] = useState([]);
    const [jogador, setJogador] = useState(null);
    const [inimigo, setInimigo] = useState(null);
    const [ladoSelecionado, setLadoSelecionado] = useState("jogador");

    const imagens = {
        Naruto: { icon: "imagens/personagens/icon/Narutoicon.png", foto: "imagens/personagens/Naruteggs.png" },
        Sasuke: { icon: "imagens/personagens/icon/SasukeIcon.png", foto: "imagens/personagens/Sasukeggs.png" },
        Kakashi: { icon: "imagens/personagens/icon/Kakashiicon.png", foto: "imagens/personagens/Kakasheggs.png" },
        Pain: { icon: "imagens/personagens/icon/Painicon.png", foto: "imagens/personagens/Painggs.png" },
        Itachi: { icon: "imagens/personagens/icon/Itachiicon.png", foto: "imagens/personagens/Itachieggs.png" },
        Orochimaru: { icon: "imagens/personagens/icon/Orochicon.png", foto: "imagens/personagens/Orocheggs.png" }
    };

    useEffect(() => {
        fetch("http://localhost:8081/personagem")
            .then(res => res.json())
            .then(data => {
                setPersonagens(data);
                if (data.length >= 2) {
                    setJogador(data[0]);
                    setInimigo(data[1]);
                }
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <>
            <div className="FullBg">
                <div className={`PlayerCard ${ladoSelecionado === "jogador" ? "ladoAtivo" : ""}`} onClick={() => setLadoSelecionado("jogador")}>
                    {jogador && <img src={imagens[jogador.nome]?.foto} alt={jogador.nome} />}
                </div>

                <div className="versus">
                    <img src="imagens/background/Versus.png" alt="" />
                </div>

                <div className="personagens">
                    <div className="selecoes">
                        {personagens.map((personagem) => (
                            <div
                                key={personagem.id}
                                className={`personagem ${(ladoSelecionado === "jogador" && jogador?.id === personagem.id) || (ladoSelecionado === "inimigo" && inimigo?.id === personagem.id) ? "ativo" : ""}`}
                                onClick={() => {
                                    if (ladoSelecionado === "jogador") setJogador(personagem);
                                    else setInimigo(personagem);
                                }}
                            >
                                <img src={imagens[personagem.nome]?.icon} alt={personagem.nome} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="botao" onClick={async () => {
                    try {
                        const response = await fetch("http://localhost:8081/partida/create", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                // Nomes corrigidos para bater com o Record Java
                                personagemJogadorId: jogador.id,
                                personagemRivalId: inimigo.id
                            })
                        });

                        const partida = await response.json();

                        if (partida.id) {
                            navigate("/batalha", {
                                state: {
                                    partidaId: partida.id,
                                    jogador,
                                    inimigo
                                }
                            });
                        } else {
                            alert("Erro ao criar partida: ID não retornado.");
                        }
                    } catch (err) {
                        console.log(err);
                        alert("Erro ao criar partida");
                    }
                }}>
                    <img src="imagens/Confirmar.png" alt="" />
                </div>

                <div className={`EnemyCard ${ladoSelecionado === "inimigo" ? "ladoAtivo" : ""}`} onClick={() => setLadoSelecionado("inimigo")}>
                    {inimigo && <img src={imagens[inimigo.nome]?.foto} alt={inimigo.nome} />}
                </div>
            </div>
        </>
    );
}

export default Select;