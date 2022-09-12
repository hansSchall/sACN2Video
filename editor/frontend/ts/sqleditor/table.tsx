export default function Table(props: {
    data: any[],
}) {
    const headings = Object.keys(props.data[0]);
    return (
        <table>
            <thead>
                <tr>
                    {headings.map(heading => {
                        return <th key={heading}>{heading}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {props.data.map((row, index) => {
                    return <tr key={index}>
                        {headings.map((key, index) => {
                            return <td key={row[key]}>{row[key]}</td>
                        })}
                    </tr>;
                })}
            </tbody>
        </table>
    );
}
