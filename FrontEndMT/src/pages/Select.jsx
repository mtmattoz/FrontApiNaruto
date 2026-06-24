import './Select.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Select() {

const navigate = useNavigate();

const personagens = [
{
id:1,
nome:"Naruto",
icon:"imagens/personagens/icon/Narutoicon.png",
foto:"imagens/personagens/Naruteggs.png"
},
{
id:2,
nome:"Sasuke",
icon:"imagens/personagens/icon/SasukeIcon.png",
foto:"imagens/personagens/Sasukeggs.png"
},
{
id:3,
nome:"Kakashi",
icon:"imagens/personagens/icon/Kakashiicon.png",
foto:"imagens/personagens/Kakasheggs.png"
},
{
id:4,
nome:"Pain",
icon:"imagens/personagens/icon/Painicon.png",
foto:"imagens/personagens/Painggs.png"
},
{
id:5,
nome:"Itachi",
icon:"imagens/personagens/icon/Itachiicon.png",
foto:"imagens/personagens/Itachieggs.png"
},
{
id:6,
nome:"Orochimaru",
icon:"imagens/personagens/icon/Orochicon.png",
foto:"imagens/personagens/Orocheggs.png"
}
];

const [jogador,setJogador] =
useState(personagens[0]);

const [inimigo,setInimigo] =
useState(personagens[1]);

const [ladoSelecionado,setLadoSelecionado] =
useState("jogador");

return (
<>

<div className="FullBg">

<div
className={`PlayerCard ${
ladoSelecionado==="jogador"
? "ladoAtivo"
: ""
}`}

onClick={()=>
setLadoSelecionado("jogador")
}
>

<img
src={jogador.foto}
alt=""
/>

</div>

<div className="versus">
<img src='imagens/background/Versus.png' alt="" />
</div>

<div className="personagens">

<div className="selecoes">

{personagens.map((personagem)=>(

<div
key={personagem.id}

className={`personagem ${
(
ladoSelecionado==="jogador"
&& jogador.id===personagem.id
)

||

(
ladoSelecionado==="inimigo"
&& inimigo.id===personagem.id
)

? "ativo"
: ""

}`}

onClick={()=>{

if(ladoSelecionado==="jogador"){
setJogador(personagem);
}

else{
setInimigo(personagem);
}

}}
>

<img
src={personagem.icon}
alt={personagem.nome}
/>

</div>

))}

</div>

</div>

<div
className="botao"
onClick={() =>
navigate('/batalha')
}
>

<img
src="imagens/Confirmar.png"
alt=""
/>

</div>

<div
className={`EnemyCard ${
ladoSelecionado==="inimigo"
? "ladoAtivo"
: ""
}`}

onClick={()=>
setLadoSelecionado("inimigo")
}
>

<img
src={inimigo.foto}
alt=""
/>

</div>

</div>

</>
);

}

export default Select;