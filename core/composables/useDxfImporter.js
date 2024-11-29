import { DxfParser } from 'dxf-parser';
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Parses an uploaded dxf file and returns a string in JSON format.
 * @param { object } upload - The file input object to be parsed.
 * @return { string } - The dxf parser output in JSON format.
 */

export const useDxfImporter = (upload) => {
	return new Promise((resolve, reject) => {

		let reader = new FileReader();

		reader.readAsText(upload);

		reader.onload = function(e) {
			let fileText = e.target.result;
			let parser = new DxfParser();
			let dxf = null;

			try {
				dxf = parser.parseSync(fileText);
			} catch(err) {
				return console.error(err.stack);
			}
			console.log('Dxf parsed!');
			resolve(dxf);
			// If string is required

		};

	});

}
