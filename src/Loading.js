import CircularProgress from '@mui/joy/CircularProgress';

export default function Loading(){
    return(
        <div className='loadingCircle'>
            <CircularProgress variant="plain" size="lg" color='neutral' />
        </div>
    )
}