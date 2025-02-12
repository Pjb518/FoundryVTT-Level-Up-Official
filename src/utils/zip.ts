export default (...rows: any[]) => [...rows[0]].map((_, c) => rows.map((row) => row[c]));
