import './Battle.css';
import { useLocation, useNavigate } from 'react-router-dom'; // 1. Adicionado o useNavigate aqui
import { useEffect, useState } from 'react';

function Batalha() {
    const location = useLocation();
    const navigate = useNavigate(); // 2. Instanciado o navigate aqui

    const jogador = location.state?.jogador;
    const inimigo = location.state?.inimigo;
    const partidaId = location.state?.partidaId;

    const [ataques, setAtaques] = useState([]);
    const [ataquesRival, setAtaquesRival] = useState([]);
    const [historico, setHistorico] = useState([]);
    const [vidaJogador, setVidaJogador] = useState(100);
    const [vidaInimigo, setVidaInimigo] = useState(100);
    const [finalizada, setFinalizada] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8081/ataque")
            .then(res => res.json())
            .then(data => {
                let filtrados = [];
                if (jogador.id === 1) filtrados = data.slice(0, 2);
                else if (jogador.id === 2) filtrados = data.slice(2, 4);
                else if (jogador.id === 3) filtrados = data.slice(4, 6);
                else if (jogador.id === 4) filtrados = data.slice(6, 8);
                else if (jogador.id === 5) filtrados = data.slice(8, 10);
                else if (jogador.id === 6) filtrados = data.slice(10, 12);
                setAtaques(filtrados);

                let filtradosRival = [];
                if (inimigo.id === 1) filtradosRival = data.slice(0, 2);
                else if (inimigo.id === 2) filtradosRival = data.slice(2, 4);
                else if (inimigo.id === 3) filtradosRival = data.slice(4, 6);
                else if (inimigo.id === 4) filtradosRival = data.slice(6, 8);
                else if (inimigo.id === 5) filtradosRival = data.slice(8, 10);
                else if (inimigo.id === 6) filtradosRival = data.slice(10, 12);
                setAtaquesRival(filtradosRival);
            })
            .catch(console.error);
    }, [jogador, inimigo]);

    async function atacar(ataque) {
        if (finalizada) return;

        try {
            const response = await fetch("http://localhost:8081/partida/atacar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    partidaId: partidaId, 
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

            // 3. A MUDANÇA ESTÁ AQUI NESTE BLOCO IF:
            if (resultado.finalizada) {
                const nomeGanhador = resultado.vencedor === 'JOGADOR' ? jogador.nome : inimigo.nome;
                
                // Formata o nome para buscar a imagem correta (ex: "Rock Lee" vira "rocklee")
                const fotoLimpa = nomeGanhador.toLowerCase().replace(/\s/g, '');

                novoHistorico.push(`FIM DE JOGO! O vencedor foi: ${nomeGanhador}`);
                setHistorico(novoHistorico);
                
                // Aguarda 1.5 segundos para o jogador ver o HP zerar e a mensagem de Fim de Jogo, depois muda a tela
                setTimeout(() => {
                    navigate('/fim', { 
                        state: { 
                            vencedorNome: nomeGanhador,
                            fotoVencedor: fotoLimpa
                        } 
                    });
                }, 1500);

                return; // Para a execução aqui para não adicionar a linha do else
            } else {
                // 1. Calcula o dano exato: Vida antiga do React MENOS a vida nova vinda do Java
                const danoTomado = vidaJogador - resultado.vidaJogador;

                // 2. Procura no state qual ataque do inimigo tira exatamente esse dano
                const ataqueCerto = ataquesRival.find(atk => atk.dano === danoTomado);

                // 3. Extrai o nome do ataque (com uma proteção de segurança caso não encontre)
                const golpeInimigo = ataqueCerto ? ataqueCerto.nome : "um ataque misterioso";
                
                novoHistorico.push(`${inimigo.nome} usou ${golpeInimigo}!`);
            }
            setHistorico(novoHistorico);

        } catch (err) {
            console.error(err);

            if (err.message.includes("Partida finalizada")) {
                alert("A batalha acabou! O vencedor foi decidido.");
            } else {
                alert("Erro ao realizar o ataque.");
            }
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
                <img src={`imagens/personagens/${jogador?.nome}Costa.png`} alt="" />
            </div>

            <div className="StatsRival">
                <div className="infosRival">
                    <h2>{inimigo?.nome}</h2>
                    <p>HP: {vidaInimigo}</p>
                </div>
            </div>

            <div className="rival">
                <img src={`imagens/personagens/${inimigo?.nome}Frente.png`} alt="" />
            </div>

            <div className="AtkBar">
                {ataques.map((ataque) => (
                    <button
                        key={ataque.id}
                        className="ataque"
                        disabled={finalizada}
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