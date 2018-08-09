import { Table } from 'react-bootstrap';
import React from 'react';

function table(data, id = true, limit = data.length){

    return (
        <Table className="tableClass" striped bordered condensed hover><thead><tr>
            { id && <th>#</th>}
            {Object.keys(data[0]).map((key) => {
                return <th>{key}</th>
            })}

        </tr>
        </thead>
        <tbody>

        {data.slice(0, limit).map((dataentry, i)=>
            <tr>
                { id && <td>{i}</td>}
                {Object.keys(dataentry).map((key) => {
                    return <td>{ dataentry[key].toString() }</td>
                })}
            </tr>
        )}
        </tbody>
    </Table>)
}


export {table};
