import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Fim.css';

const gifsVitoria = {
    naruto: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2dyazE1M28zdHc1NWl6YW9iazFjMGdvMWVxYWU1MXN2a3Bqc3plNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4F3N277RL2NvW/giphy.gif",
    sasuke: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2k3MmRraXN1cGhod3RhZmszMm0zdG84bTNyNm9wZWVjc2tyMGp4byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1dcLFNKRUKvte/giphy.gif",
    kakashi: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnhhbzF2NXJybzNnc3luaXQ5a3R4Z3UyeXA1cmtxMmp4ZmYyM3lzayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vXyIMuWbGTMtO/giphy.gif",
    pain: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHdtNGx6NHBlbmRxZXFwdHY1cG81bmozOXQxc2N5eXB5cDh1NW5rNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hMAhEUs3fwEbC/giphy.gif",
    itachi: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHVpcm9ucHVjcHoyeHBwdHVsYXdzdjRxMjR1d3ZudXR2ZWk2MXgxdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yzWxW50V4W8Bq/giphy.gif",
    orochimaru: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3p4ZGtwdHJ3Mmdxb3A5MmcwZnY0bGdxcjl2ZWI3cnd4dGZ6and1ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l7hW3QhDalRjW/giphy.gif",
    padrao: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHVpcm9ucHVjcHoyeHBwdHVsYXdzdjRxMjR1d3ZudXR2ZWk2MXgxdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yzWxW50V4W8Bq/giphy.gif"
};

const frasesVitoria = {
    naruto: '"Eu não vou fugir, eu nunca volto atrás da minha palavra. Esse é o meu jeito ninja!"',
    sasuke: '"Eu fechei meus olhos há muito tempo... Meus objetivos estão apenas na escuridão."',
    kakashi: '"Aqueles que quebram as regras são lixo, mas aqueles que abandonam seus amigos são piores que lixo."',
    pain: '"Aqueles que não entendem a verdadeira dor, nunca poderão entender a verdadeira paz."',
    itachi: '"Você não tem ódio o suficiente... e nunca terá."',
    orochimaru: '"A verdadeira força vem de dominar todas as técnicas do mundo."',
    padrao: '"Uma vitória gloriosa! A lenda continua..."'
};

function Fim() {
    const location = useLocation();
    const navigate = useNavigate();

    const { vencedorNome, fotoVencedor } = location.state || {};

    const [mostrarHistorico, setMostrarHistorico] = useState(false);
    const [partidas, setPartidas] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8081/historico")
            .then(res => res.json())
            .then(data => setPartidas(data))
            .catch(console.error);
    }, []);

    if (!vencedorNome) {
        navigate('/select');
        return null;
    }

    const gifDoCampeao = gifsVitoria[fotoVencedor] || gifsVitoria.padrao;
    const fraseDoCampeao = frasesVitoria[fotoVencedor] || frasesVitoria.padrao;

    return (
        <div className="FimContainer">
            
            <h1 className="FimTitulo">FIM DE BATALHA</h1>
            
            <h2 className="FimSubtitulo">
                 Vencedor: {vencedorNome}
            </h2>

            {/* A FOTO FOI MOVIDA PARA CIMA */}
            <div className="GifContainer">
                <img src={gifDoCampeao} alt={`Comemoração de ${vencedorNome}`} />
            </div>

            {/* A FRASE FOI MOVIDA PARA BAIXO DA FOTO E EM CIMA DOS BOTÕES */}
            <p className="FraseCampeao">{fraseDoCampeao}</p>

            <div className="BotoesContainer">
                <button className="BotaoImagem" onClick={() => navigate('/select')}>
                    <img src="imagens/Voltar.png" alt="Nova Partida" />
                </button>

                <button className="BotaoImagem" onClick={() => setMostrarHistorico(!mostrarHistorico)}>
                    <img src="imagens/Historico.png" alt="Ver Histórico" />
                </button>
            </div>

            {mostrarHistorico && (
                <div className="PergaminhoContainer">
                    <h2 className="PergaminhoTitulo">Registro Ninja</h2>

                    <div className="PergaminhoConteudo">
                        {partidas.length > 0 ? (
                            partidas.map(p => (
                                <div key={p.id} className="PartidaItem">
                                    <p className="PartidaId">Partida #{p.id}</p>
                                    <p>Luta: {p.personagemJogador} x {p.personagemRival}</p>
                                    <p>Ganhador: <strong className={p.vencedor === 'JOGADOR' ? 'VencedorVerde' : 'PerdedorVermelho'}>
                                        {p.vencedor === 'JOGADOR' ? p.personagemJogador : p.personagemRival}
                                    </strong></p>
                                    <p>Turnos: {p.turnos}</p>
                                </div>
                            ))
                        ) : (
                            <p>Nenhuma batalha foi registrada ainda...</p>
                        )}
                    </div>

                    <button className="BotaoFechar" onClick={() => setMostrarHistorico(false)}>
                        Fechar Pergaminho
                    </button>
                </div>
            )}

        </div>
    );
}

export default Fim;