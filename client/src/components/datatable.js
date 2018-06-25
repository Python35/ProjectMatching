import { Table } from 'react-bootstrap';
import React from 'react';


function table(data){
    return (
        <Table className="tableClass" striped bordered condensed hover> <thead> <tr>
            <th>#</th>
            {Object.keys(data[0]).map((key) => {
                return <th>{ key }</th>
            })}

        </tr>
        </thead>
        <tbody>
        {data.map((dataentry, i)=>
            <tr>
                <td>{i}</td>
                {Object.keys(dataentry).map((key) => {
                    return <td>{ dataentry[key].toString() }</td>
                })}
            </tr>
        )}
        </tbody>
    </Table>)
}

export default table;
