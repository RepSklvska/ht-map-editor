import React, {useEffect, useState} from 'react';
import copy from 'copy-to-clipboard'

function App() {
	const [mapTable, setMapTable] = useState<number[][]>([
		[1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	])
	const [codeMovable, setCodeMovable] = useState<string>('')
	const [codeSetUnit, setCodeSetUnit] = useState<string>('')
	
	const onClickCell = (row: number, col: number) => {
		const panelNumber = row * 17 + col
		return () => {
			// console.log(panelNumber)
			const mT = mapTable
			mT[row][col] = (mT[row][col] + 1) % 3
			setMapTable(mT)
			setCodeMovable(generateCode('movable'))
			setCodeSetUnit(generateCode('setUnit'))
		}
	}
	const valueToColor = (value: number) => {
		if (value % 3 === 0) { // unavailable panel
			return 'black'
		}
		if (value % 3 === 1) { // movable panel
			return 'gray'
		}
		if (value % 3 === 2) { // movable panel that can place units
			return 'blue'
		}
		return 'black'
	}
	const generateCode = (mode: 'movable' | 'setUnit') => {
		let code: string = ''
		for (let i = 0; i < 17; i++) {
			for (let ii = 0; ii < 17; ii++) {
				if (mapTable[i][ii] % 3 === 0) {
					code += '\tPUSH 0\n\tITOB\n'
					continue
				}
				if (mode === 'movable') {
					if (mapTable[i][ii] % 3 !== 0) {
						code += '\tPUSH 1\n\tITOB\n'
					}
				} else {
					if (mapTable[i][ii] % 3 === 2) {
						code += '\tPUSH 1\n\tITOB\n'
					} else {
						code += '\tPUSH 0\n\tITOB\n'
					}
				}
			}
		}
		return code.trimEnd()
	}
	
	useEffect(() => {
		setCodeMovable(generateCode('movable'))
		setCodeSetUnit(generateCode('setUnit'))
	}, [])
	
	return (
		<div className="App">
			<header className="App-header">
				<p>Black = blocked / Gray = movable / Blue = movable & can set unit </p>
				<p>Click to change color. </p>
				<table>
					<tbody>
					{mapTable.map((row, keyR) => (<tr key={keyR} style={{height: 25}}>
						{row.map((col, keyC) => {
							let color: 'black' | 'gray' | 'blue' = valueToColor(col)
							return (<td key={keyC} style={{width: 25, backgroundColor: color}}
										onMouseUp={(e) => {
											onClickCell(keyR, keyC)()
											// console.log(mapTable)
											// @ts-ignore
											e.target.style.backgroundColor = valueToColor(mapTable[keyR][keyC])
										}}/>)
						})}
					</tr>))}
					</tbody>
				</table>
				<div style={{display: 'flex'}}>
					<div>
						<p>Movable panels</p>
						<p><textarea style={{width: 200, maxWidth: 200, minWidth: 200, height: 200}}
									 value={codeMovable}></textarea></p>
						<p>
							<button onClick={() => copy(codeMovable)}>Copy
							</button>
						</p>
					</div>
					<div>
						<p>Panels for setting units</p>
						<p><textarea style={{width: 200, maxWidth: 200, minWidth: 200, height: 200}}
									 value={codeSetUnit}></textarea></p>
						<p>
							<button onClick={() => copy(codeSetUnit)}>Copy
							</button>
						</p>
					</div>
				</div>
			</header>
		</div>
	);
}

export default App;
