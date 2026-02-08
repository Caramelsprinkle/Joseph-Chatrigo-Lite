const message = ( { content } : { content : string } ) => {
    <div className="lg-rounded w-4/5 h-fit pt-2 pb-2 bg-orange-400">
        {content}
    </div>
}

export default message