import React, {useEffect, useState} from 'react'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import SearchBar from "material-ui-search-bar";

import { TableWrapper } from '../App.style'

const BmiSharesTable=(props)=>{

    const { sharesData }= props;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [rows, setRows] = useState([]);
    const [filterRows, setFilterRows] = useState([]);
    const [searched, setSearched] = useState("");
    const [orderBy, setOrderBy] = useState("date");
    const [maxDay, setMaxDay] = useState({difference:0,date:null});

    const headCells =['date', 'open','high','low','close','difference']


    useEffect(()=>{
        createData();
    },[sharesData])


    const requestSearch = (searchedVal) => {
        const filteredRows = rows.filter((row) => {
          return row.date.toLowerCase().includes(searchedVal.toLowerCase());
        });
        setFilterRows(filteredRows);
    };
    
    const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }
    
    
    const createData=()=>{
        for(let record in sharesData){
            let row={
                date:record,
                open:sharesData[record]["1. open"],
                high:sharesData[record]["2. high"],
                low:sharesData[record]["3. low"],
                close:sharesData[record]["4. close"],
                difference:(parseFloat(sharesData[record]["1. open"])-parseFloat(sharesData[record]["4. close"])).toFixed(2)
            }
            setRows(rows=>[...rows,row])
            setFilterRows(rows=>[...rows,row])

            if(row.difference>maxDay.difference){
                setMaxDay(row)
            }
        }
    }
    
    
    // const checkMaxDay=()=>{
    //     console.log(rows.map(date=>date.difference));
        
    // }

    const sortBy=(key)=>{
        setOrderBy(key)
        setRows(filterRows
            .sort((a,b)=>{
                return a[key]-b[key]>0? 1 :a[key]-b[key] <0? -1: 0
            })
        )
    }

    return(
        <TableWrapper>
               <SearchBar
                    value={searched}
                    onChange={(searchVal) => requestSearch(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                />
            <TableContainer>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {
                                headCells.map(headCell=>{
                                    return(
                                        <TableCell align={headCell==="date"?"left":"right"}>
                                            {headCell}
                                            {
                                                headCell!=="date"&&
                                                <TableSortLabel
                                                    active={orderBy===headCell}
                                                    onClick={e=>sortBy(headCell)}
                                                />
                                            }
                                        </TableCell>
                                    );
                                })
                            }
                        
                        </TableRow>
                    </TableHead>

                    <TableBody>
                    {
                        filterRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(record => (
                            <TableRow key={record.open}>
                                <TableCell component="th" scope="row"> {record.date}</TableCell>
                                <TableCell align="right">{record.open}</TableCell>
                                <TableCell align="right">{record.high}</TableCell>
                                <TableCell align="right">{record.low}</TableCell>
                                <TableCell align="right">{record.close}</TableCell>
                                <TableCell align="right">{record.difference}</TableCell>
                            </TableRow>
                        ))
                    }
                    </TableBody>
                </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={filterRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <b>Maximum profit day: {maxDay.date}</b>
                <br/>
                <b>Maximum profit: {maxDay.difference}</b>

        </TableWrapper>
    );

}


export default BmiSharesTable