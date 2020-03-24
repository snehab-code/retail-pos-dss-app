import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import IconButton from '@material-ui/core/IconButton'
import Add from '@material-ui/icons/Add'
import Modal from 'react-modal'
import modalStyles from '../../config/modalCss'
import { customStylesTable } from '../../config/dataTableTheme'
import PayableShow from './PayableShow'

const dataColumns = [{
    name: 'Date',
    selector: 'transactionDate',
    sortable: true,
    cell: row => `${moment(row.transactionDate.date).format('MMM DD')}`
},
{
    name: 'Invoice',
    selector: 'invoice',
    sortable: true
},
{
    name: 'Pay to',
    selector: 'payableTo.name',
    sortable: true,
    grow:2
},
{
    name: 'Amount', 
    selector: 'amount',
    center: true
},
{
    name: 'Notes',
    selector: 'remark',
    center: true,
    sortable: true
},
{
    name: 'Due',
    selector: 'dueDate',
    sortable: true,
    cell: row => `${moment(row.dueDate.date).format('MMM DD')}`
},
{
    name: 'Status',
    selector: 'isPaid',
    center: true,
    sortable: true,
    cell: row => row.isPaid ? 'paid' : 'pending'
}
]

function PayablesList(props) {

    const [modalIsOpen, setModalState] = useState(false)
    const [payableId, setPayableId] = useState('')

    Modal.setAppElement('#root')  

    const handleRowClicked = (row) => {
        setPayableId(row.transactionDate.id)
        setModalState(true)
    }

    const closeModal = () => {
        setModalState(false)
    }

    return (
        <div className="businessContent">
            <Modal 
                style={modalStyles}
                isOpen={modalIsOpen}
                // onAfterOpen={this.afterOpenModal}
                onRequestClose={closeModal}
            >
                <PayableShow id={payableId}/>
            </Modal>
            <div className='contentHeader'>
            <span className='headerText'>Expenses</span>
            <Link to={`/businesses/${props.match.params.businessId}/expenses/new`}><IconButton className='tableButton' >
                <Add />
            </IconButton>
            </Link>
            </div>
            <DataTable
                noHeader
                theme = 'green'
                highlightOnHover
                striped
                columns={dataColumns}
                data={props.payables}
                customStyles={customStylesTable}
                onRowClicked={handleRowClicked}
            />
            {/* - add a Supplier
            <Button>Add Supplier</Button> */}
            {/* - add GRNs on receiving goods ie write to transactions
            <Button>Material Received</Button> */}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        payables: state.payables.map(payable => {
            const newData = {
                transactionDate: {date: payable.transactionDate, id: payable._id}
            }
            return {...payable, ...newData}
        })
    }
}

export default connect(mapStateToProps)(PayablesList)