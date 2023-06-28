import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const Error = styled.p`
    font-family: 'lato', sans-serif;
    background-color: #b7322c;
    padding: 1rem;
    text-align: center;
    border-radius: 10px;
    color: #fff;
    font-weight: bold;
    font-size: 20px;
    margin-top: 5px;
`;

const Label = styled.label`
    font-family: 'lato', sans-serif;
    color: #fff;
    font-weight: bold;
    font-size: 20px;
    margin-top: 20px;
    display: block;
`;

const Select = styled.select`
    width: 100%;
    display: block;
    padding: 14px;
    -webkit-appearance: none;
    border-radius: 10px;
    border: none;
    font-size: 16px;
    margin-top: 10px;
`;

const InputSubmit = styled.input`
    margin-top: 20px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66a2fe;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #fff;
    transition: background-color .3s ease;
    &:hover {
        background-color: #326AC0;
        cursor: pointer;
    }
`;

export const Formulario = ({ setCotizacion, setCargando }) => {

    useEffect(() => {

        conseguirCriptomonedas();

    }, []);

    const conseguirCriptomonedas = async () => {

        const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
        const request = await fetch(url);
        const response = await request.json();

        const arrayCriptos = response.Data.map(criptos => {

            const objetoCripto = {
                id: criptos.CoinInfo.Name,
                nombre: criptos.CoinInfo.FullName
            }

            return objetoCripto;

        })

        setCriptos(arrayCriptos);

    }

    const cotizarCripto = async(e) => {

        e.preventDefault();

        setCargando(true);

        const moneda = e.target[0].value;
        const cripto = e.target[1].value;

        if([moneda, cripto].includes("")) {

            setError(true);
            setCargando(false);
            return;

        }

        setError(false);

        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cripto}&tsyms=${moneda}`;
        const request = await fetch(url);
        const response = await request.json();

        setCotizacion(response.DISPLAY[cripto][moneda]);
        setCargando(false);

    }

    const [criptos, setCriptos] = useState([]);
    const [error, setError] = useState(false);

    const monedas = [
        { id: 'USD', nombre: 'Dolar de Estados Unidos' },
        { id: 'CLP', nombre: 'Peso chileno' },
        { id: 'EUR', nombre: 'Euro' },
        { id: 'GBP', nombre: 'Libra Esterlina' }
    ];

    return (

        <>

            {error ? <Error>Todos los campos son obligatorios</Error> : ""}

            <form onSubmit={cotizarCripto}>

                <Label>Elige tu moneda</Label>

                <Select>
                    <option value="">- Elige tu moneda -</option>
                    {monedas.map(moneda => (
                        <option key={moneda.id} value={moneda.id}>{moneda.nombre}</option>
                    ))}
                </Select>

                <Label>Elige tu criptomoneda</Label>

                <Select>
                    <option value="">- Elige tu criptomoneda -</option>
                    {criptos.map(cripto => (
                        <option key={cripto.id} value={cripto.id}>{cripto.nombre}</option>
                    ))}
                </Select>

                <InputSubmit type="submit" value="Cotizar" />

            </form>

        </>

    )
}
