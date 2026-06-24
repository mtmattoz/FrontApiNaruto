import './Battle.css';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Batalha() {
    const location = useLocation();
    const jogador = location.state?.jogador;
    const inimigo = location.state?.inimigo;
    const partidaId = location.state?.partidaId;

    const [ataques, setAtaques] = useState([]);
    const [historico, setHistorico] = useState([]);
    const [vidaJogador, setVidaJogador] = useState(100);
    const [vidaInimigo, setVidaInimigo] = useState(100);
    const [finalizada, setFinalizada] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8081/ataque")
            .then(res => res.json())
            .then(data => {
                // Lógica de filtro mantida como você fez
                let filtrados = [];
                if (jogador.id === 1) filtrados = data.slice(0, 2);
                else if (jogador.id === 2) filtrados = data.slice(2, 4);
                else if (jogador.id === 3) filtrados = data.slice(4, 6);
                else if (jogador.id === 4) filtrados = data.slice(6, 8);
                else if (jogador.id === 5) filtrados = data.slice(8, 10);
                else if (jogador.id === 6) filtrados = data.slice(10, 12);
                setAtaques(filtrados);
            })
            .catch(console.error);
    }, [jogador]);

    async function atacar(ataque) {
        if (finalizada) return;

        try {
            // MUDEI A URL PARA /atacar
            const response = await fetch("http://localhost:8081/partida/atacar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    partidaId: partidaId, // Use o ID da partida que veio no location.state
                    ataqueId: ataque.id
                })
            });

            if (!response.ok) throw new Error("Erro ao atacar");

            const resultado = await response.json();

            // 1. Atualiza os estados com os dados do backend
            setVidaJogador(resultado.vidaJogador);
            setVidaInimigo(resultado.vidaRival);
            setFinalizada(resultado.finalizada);

            // 2. Atualiza o Histórico (Log)
            const novoHistorico = [...historico, `${jogador.nome} usou ${ataque.nome}!`];

            if (resultado.finalizada) {
                novoHistorico.push(`FIM DE JOGO! Vencedor: ${resultado.vencedor}`);
            } else {
                novoHistorico.push(`${inimigo.nome} atacou de volta!`);
            }

            setHistorico(novoHistorico);

        } catch (err) {
            console.error(err);

            if (err.message.includes("Partida finalizada")) {
                alert("A batalha acabou! O vencedor foi decidido.");
            } else {
                alert("Erro ao realizar o ataque.");
            }
            alert("Erro ao realizar o ataque.");
        }
    }
    
    return (
        <div className="fbody">
            <div className="log">
                <p className="Titulo">Registro de Batalha</p>
                {historico.map((item, index) => <p key={index}>{item}</p>)}
            </div>

            <div className="StatsJogador">
                <div className="infosJogador">
                    <h2>{jogador?.nome}</h2>
                    <p>HP: {vidaJogador}</p>
                </div>
            </div>

            <div className="jogador">
                <img src={`imagens/personagens/${jogador.nome}eggs.png`} alt="" />
            </div>

            <div className="StatsRival">
                <div className="infosRival">
                    <h2>{inimigo?.nome}</h2>
                    <p>HP: {vidaInimigo}</p>
                </div>
            </div>

            <div className="rival">
                <img src={`imagens/personagens/${inimigo.nome}eggs.png`} alt="" />
            </div>

            <div className="AtkBar">
                {ataques.map((ataque) => (
                    <button
                        key={ataque.id}
                        className="ataque"
                        disabled={finalizada} // DESABILITA BOTÃO SE ACABOU
                        onClick={() => atacar(ataque)}
                    >
                        {ataque.nome}
                    </button>
                ))}
            </div>

            <div className="DescBar">
                <div className="descricao">
                    {finalizada ? "Partida encerrada!" : "Escolha um ataque"}
                </div>
            </div>
        </div>
    );
}

export default Batalha;