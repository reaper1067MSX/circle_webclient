import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import styled from 'styled-components';
import DecimalRenderer from './col_render_numerodecimal';
import EnteroRenderer from './col_render_numeroentero';
import BotonEliminarRenderer from './col_render_boton_elim';
import BotonModificarRenderer from './col_render_boton_modif';
import FechaRenderer from './col_render_fecha_corta';
import EnteroEditor from './col_edit_numeroentero';
import DecimalEditor from './col_edit_numerodecimal';
import CalculatorDecimalRenderer from './col_render_cal_numerodecimal';

import './ag_grid.css';
import './theme_silver.css';

const ContenedorGrid = styled.div`
    width: 100%;
    height: ${props => props.altura};    
    margin-bottom: 10px;
    margin-top: 10px;
`;

export default class AgGridRender extends React.Component{       
    generarColumna(def_columna){
        let defcol={};
        defcol.headerName = def_columna.header; 
        defcol.field = def_columna.field;
        defcol.width = def_columna.width;
        defcol.editable = def_columna.editable;
        defcol.valueFormatter = def_columna.valueFormatter;
        defcol.valueGetter = def_columna.valueGetter;
        defcol.checkboxSelection = def_columna.checkboxSelection;
        defcol.suppressSorting = def_columna.suppressSorting;
        defcol.suppressMenu = def_columna.suppressMenu;
        defcol.suppressFilter = def_columna.suppressFilter;            
        defcol.pinned = def_columna.pinned;

        switch(def_columna.type){                
            case "num_entero":
                defcol.cellRendererFramework = EnteroRenderer;
                break;
            case "num_decimal":
                defcol.cellRendererFramework = DecimalRenderer;
                break;
            case "boton_elim":                    
                defcol.cellRendererFramework = BotonEliminarRenderer;
                break;
            case "boton_modi":                    
                defcol.cellRendererFramework = BotonModificarRenderer;
                break;            
            case "fecha":
                defcol.cellRendererFramework = FechaRenderer;
                break;
            case "num_entero_edit":                
                defcol.cellEditorFramework = EnteroEditor;
                defcol.cellClass = 'number-cell';
                break;            
            case "num_decimal_edit":
                defcol.cellEditorFramework = DecimalEditor;
                defcol.cellClass = 'number-cell';
                break;
            case "num_decimal_cal":
                defcol.cellRendererFramework = CalculatorDecimalRenderer;
                break;
            
            default:
                break;
        }

        return defcol;
    }


    renderizarColumnas(def_columnas_input){        
        let def_columnas = [];
        def_columnas_input.forEach((columna)=>{            
            let defcol = {};
            if (columna.children){
                defcol.headerName = columna.header;
                defcol.headerClass = 'row-header-parent';
                let subcolumnas = [];
                columna.children.forEach((subcolumna)=>{
                    subcolumnas.push(this.generarColumna(subcolumna));
                });
                defcol.children = subcolumnas;
            }else{                        
                defcol = this.generarColumna(columna);
            }

            def_columnas.push(defcol);
        });
        return def_columnas;
    }

    componentDidUpdate(){
        this.props.gridOptions.api.refreshCells();
    }

    render(){
        return(
            <ContenedorGrid altura={this.props.altura} className="ag-silver" >
                <AgGridReact
                    columnDefs={this.renderizarColumnas(this.props.columnas)}
                    rowData={this.props.data}
                    gridOptions={this.props.gridOptions}
                    onGridReady={this.props.onGridReady}                    
                    suppressMovableColumns={true}
                />                  
            </ContenedorGrid>
        );
    }
}