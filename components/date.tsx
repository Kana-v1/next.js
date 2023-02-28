import { parseISO, format } from 'date-fns'

export default function Date({ dateString }: { dateString: string }) {
  const date = parseISO(dateString)
  
  let formattedDate: string = '2021-11-14'

  try {
    formattedDate = format(date, 'LLLL d, yyyy')
  } catch(err) {
    console.log(`cannot format date, err:${err}; date: ${date}; dateString: ${dateString}`)
  }

  return <time dateTime={dateString}>{formattedDate}</time>
}