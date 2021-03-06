import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
// import Modal from 'react-modal'
import {Formik, Form} from 'formik'
import { KeyboardDatePicker } from '@material-ui/pickers'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Autocomplete from '@material-ui/lab/Autocomplete'

function CashForm(props) {

    // const [modalIsOpen, setModalState] = useState(false)
    const [transactionDate, setDate] = useState(Date.now())
    const [party, setParty] = useState('')
    const [linkedTo, setLinkedTo] = useState('')

    useEffect(() => {
        if (props.linkedTo && (props.debitFrom || props.creditTo)) {
            const findLinkedTo =  props.transactions.find(transaction => transaction._id === props.linkedTo)
            const findParty = props.creditTo ? props.parties.find(party => party._id === props.creditTo) : props.debitFrom ? props.parties.find(party => party._id === props.debitFrom) : ''
            if (findLinkedTo) {
                setLinkedTo(findLinkedTo)    
            }
            if (findParty) {
                setParty(findParty)
            }
        }
    }, [props.linkedTo, props.debitFrom, props.creditTo, props.transactions, props.parties])

    const balance = props.cashBank[0] && party && props.cashBank.filter(trn => trn.creditTo === party._id || trn.debitFrom === party._id).reduce((total, currentVal) => {
        if (currentVal.creditTo) {
            return total - currentVal.amount
        } else {
            return total + currentVal.amount
        }
    }, !linkedTo ? 0 : linkedTo.client ? 0 - linkedTo.amount : linkedTo.amount)

    

    const handleSubmit = (val, {setSubmitting}) => {
        const formData = {
            transactionDate,
            mode: val.mode,
            remark: val.remark,
            amount: val.amount,
            linkedTo: linkedTo._id
        }
        if (val.type === 'Receipt') {
            formData.debitFrom = party._id
        } else if (val.type === 'Payment') {
            formData.creditTo = party._id
        }
        props.handleSubmit(formData)
        setSubmitting(false)
    }

    return (
        <>
        <Formik
            // enableReinitialize 
            initialValues={{
                mode: props.mode ? props.mode : '',
                type: props.debitFrom ? 'Receipt' : props.creditTo ? 'Payment' : '',
                remark: props.remark ? props.remark : '',
                amount: props.amount ? props.amount : '',
                party,
                linkedTo
            }}
            onSubmit={handleSubmit}
            validate={values => {
                const errors = {}
                if (!transactionDate) {
                    errors.transactionDate = 'Required'
                }
                if (!party) {
                    errors.party = 'Required'
                }
                if (!linkedTo) {
                    errors.linkedTo = 'Required'
                }
                if (!values.mode) {
                    errors.mode = 'Required'
                }
                if (!values.amount) {
                    errors.amount = 'Required'
                }
                if (!values.remark) {
                    errors.remark = 'Required'
                }
                if (!values.type) {
                    errors.type = 'Required'
                }
                return errors
              }
            }
        >
        {
        (formikProps) => {
            const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit} = formikProps
            return (
            <Form onSubmit={handleSubmit}>
                <div className='formSubGroup'>
                    <KeyboardDatePicker
                        id='transactionDate'
                        name='transactionDate'
                        onChange={(date) => setDate(date)}
                        value={transactionDate}
                        format='MM/DD/YYYY'
                        label='Transaction Date'
                        error = {errors.transactionDate && true}
                        helperText={errors.transactionDate}
                    />
                    <FormControl>
                    <InputLabel>Mode</InputLabel>
                    <Select
                        error = {errors.mode && touched.mode}
                        id = 'mode'
                        name = 'mode'
                        value = {values.mode}
                        onChange = {handleChange}
                        onBlur = {handleBlur}
                        label = 'Mode'
                    >
                        {
                            ['Cash', 'Bank'].map(mode => {
                                return <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                            })
                        }
                    </Select>
                    </FormControl>
                    <FormControl>
                    <InputLabel>Type</InputLabel>
                    <Select
                        error = {errors.mode && touched.mode}
                        id = 'type'
                        name = 'type'
                        value = {values.type}
                        onChange = {handleChange}
                        onBlur = {handleBlur}
                        label = 'Type'
                    >
                        {
                            ['Payment', 'Receipt'].map(mode => {
                                return <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                            })
                        }
                    </Select>
                    </FormControl>
                </div>

                <div className='formSubGroup'>
                    <Autocomplete
                        style={{width:'100%'}}
                        options={props.parties}
                        getOptionLabel={option => option.name ? option.name : ''}
                        name='party' 
                        id='party'
                        // disableClearable
                        value={party}
                        onChange={(e, newValue) => {
                            let party = newValue
                            console.log(linkedTo, 'linkedto', newValue, 'newValue')
                            if (linkedTo && newValue) {
                                console.log('hi?')
                                if (linkedTo.payableTo && linkedTo.payableTo._id!==newValue._id) {
                                    party = linkedTo.payableTo
                                } else if(linkedTo.client) {
                                    party = linkedTo.client
                                } else if(linkedTo.supplier) {
                                    party = props.parties.find(party => party._id === linkedTo.supplier)
                                }
                            }
                            setParty(party)
                        }}
                        renderInput={params => 
                            <TextField {...params} 
                                label='party' 
                                id='party' 
                                value={values.party}
                                onChange={handleChange}
                                margin='normal'
                                error = {errors.party && true}
                                helperText= {errors.party}
                            />
                        }
                    />
                    <Autocomplete
                        style={{width:'100%'}}
                        options={party && party._id ? 
                            props.transactions.filter(trn => trn.supplier ? 
                            trn.supplier._id === party._id : 
                            trn.client ? 
                            trn.client._id === party._id : trn.payableTo._id === party._id) : 
                            props.transactions}
                        getOptionLabel={option => option.documentNumber ? option.documentNumber : option.invoiceNumber ? option.invoiceNumber : option.payableTo ? option.invoice : ''}
                        name='linkedTo' 
                        id='linkedTo'
                        // disableClearable
                        value={linkedTo}
                        onChange={(e, newValue) => {
                            if (newValue) {
                                let newParty
                                if (newValue.payableTo && newValue.payableTo._id !== party) {
                                    newParty = newValue.payableTo
                                } else if(newValue.client && newValue.client._id !== party) {
                                    newParty = newValue.client
                                } else if(newValue.supplier && newValue.supplier._id !== party) {
                                    newParty = props.parties.find(party => party._id === newValue.supplier._id)
                                }
                                setParty(newParty)
                            }
                            setLinkedTo(newValue)
                        }
                        }
                        renderInput={params => 
                            <TextField {...params} 
                                label='linkedTo' 
                                id='linkedTo' 
                                value={values.linkedTo}
                                onChange={handleChange}
                                margin='normal'
                                error = {errors.linkedTo && true}
                                helperText= {errors.linkedTo}
                            />
                        }
                    />
                </div>
                
                {/* <div style={{textAlign: 'left', width:'100%', color: '#cbd8d0'}}>
                    <span style={{paddingLeft:5, paddingTop:15, cursor: 'pointer'}} onClick={() => setModalState(true)}>New Creditor?</span>
                </div> */}

                <div className='formSubGroup'>
                    <TextField
                        error = {errors.amount && touched.amount}
                        id='amount'
                        name='amount'
                        value={values.amount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label='Amount'
                        helperText={
                            errors.amount 
                            ? 
                            errors.amount 
                            : 
                            linkedTo && party 
                            ? 
                            `${Math.abs(balance)} currently due on ${linkedTo.invoice ? linkedTo.invoice : linkedTo.invoiceNumber ? linkedTo.invoiceNumber : linkedTo.supplierInvoice ? linkedTo.supplierInvoice : 'bill'}`
                            :
                            ''}
                    />
                    <TextField
                        error = {errors.remark && touched.remark}
                        id='remark'
                        name='remark'
                        value={values.remark}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label='Note'
                        helperText={errors.remark}
                    />
                </div>

                <Button variant='outlined' type='submit' disabled={isSubmitting}>Submit</Button>
            </Form>
            )
        }}
        </Formik>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        parties: [...state.suppliers, ...state.creditors, ...state.clients],
        transactions: [...state.payables, ...state.sales, ...state.purchases],
        cashBank: state.cashBank
    }
}

export default connect(mapStateToProps)(CashForm)