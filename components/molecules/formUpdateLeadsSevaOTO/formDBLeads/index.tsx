import { Input } from 'components/atoms'
import styles from 'styles/components/molecules/formUpdateLeadsSevaOTO/formDBLeads.module.scss'
import React from 'react'

interface PropsDBLeads extends React.ComponentProps<'input'> {
  defaultValue?: number
  value?: number
  title?: string
}

const FormDBLeads = ({
  defaultValue,
  value,
  title = 'DB Leads ID',
  ...inputProps
}: PropsDBLeads) => {
  return (
    <div>
      <Input
        {...inputProps}
        value={value}
        title={title}
        type="number"
        disabled={true}
        className={styles.input}
      />
    </div>
  )
}

export default FormDBLeads
