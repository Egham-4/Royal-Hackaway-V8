import io
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from flask_app.models.DataFile import DataFile
from data_preprocessing import preprocessing
from data_preprocessing import data_profiler
from ai import data_reporter
from ai import data_analysist, visualization_types
import logging
from ai.visualization_types import PieChartVisualization, LineGraphVisualization, BarChartVisualization, AreaChartVisualization
import pandas as pd



bp = Blueprint('file_upload', __name__)

ALLOWED_EXTENSTIONS = ['csv']
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSTIONS

@bp.route('/fileupload', methods=['POST'])
@jwt_required()
def file_upload():
    user_email = get_jwt_identity()

    if 'file' not in request.files:
        return jsonify({"error": "no file provided"}), 400

    file = request.files['file']
    title = request.files['title']
    description = request.files['description']


    # file is empty
    if file.filename == '':
        return jsonify({"error": "no file"}), 400

    if file and allowed_file(file.filename):
        print("success")

        # Configure #logging
        #logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

        file_stream = io.StringIO(file.stream.read().decode("utf-8"))
        df = pd.read_csv(file_stream)

        #logging.info("Starting data preprocessing...")
        clean_csv = preprocessing.adaptive_scaling(df)

        #logging.info("Data preprocessing completed.")

        #logging.info("Extracting data dictionary...")
        extracted_data = data_profiler.generate_data_dictionary(clean_csv)
        #logging.info(f"Data extraction completed: {extracted_data.keys()}")

        #logging.info("Initializing DataAnalyzerAgent...")
        analysist = data_analysist.DataAnalyzerAgent()

        #logging.info("Performing data analysis...")
        analysis = analysist.analyse_data(
            header=extracted_data['header'],
            sample_row=extracted_data['sample_row'],
            metadata=extracted_data['metadata'],
            business_type="hotel"
        )
        #logging.info("Data analysis completed.")

        visualisation = analysis['data_visualization']


        #logging.info(f"Extracted visualization objects.")

        datavis = []
        for v in visualisation:
            if isinstance(v, (LineGraphVisualization, BarChartVisualization, AreaChartVisualization)):
                #logging.info(f"Processing visualization.")
                try:
                    revenue_dict = {
                        "Revenue Growth": {str(year): f"${revenue}M" for year, revenue in zip(clean_csv[v['x_axis']], clean_csv[v["y_axis"]])}
                    }
                    datavis.append(revenue_dict)
                    #logging.info(f"Added revenue data: {revenue_dict}")
                except KeyError as e:
                    pass
                    #logging.error(f"KeyError: {e} - Check if '{v['x_axis']}' and '{v['y_axis']}' exist in DataFrame.")
                except Exception as e:
                    pass
                    #logging.error(f"Unexpected error processing visualization: {e}")

            elif isinstance(v, PieChartVisualization):
                #logging.info("Processing PieChartVisualization.")
                try:
                    piedict = {i: clean_csv[i] for i in v['categories']}
                    datavis.append(piedict)
                    #logging.info(f"Pie chart data processed: {piedict}")
                except KeyError as e:
                    pass
                    #logging.error(f"KeyError: {e} - Check if categories exist in DataFrame.")
                except Exception as e:
                    pass
                    #logging.error(f"Unexpected error in pie chart processing: {e}")

            print(datavis) 

        #logging.info("Initializing DataReporter...")
        reporter = data_reporter.DataReporter()

        #logging.info("Generating business performance report...")

        # Ensure `visualisation` is iterable before #logging its length
        if isinstance(visualisation, list) or isinstance(visualisation, tuple):
            pass
            #logging.info(f"Extracted {len(visualisation)} visualization objects.")
        else:
            #logging.warning(f"Expected list of visualizations, but got {type(visualisation)}. Wrapping in a list.")
            visualisation = [visualisation]  # Wrap in a list

        #logging.info(f"Visualization processing will continue with {len(visualisation)} objects.")


        try:
            result = reporter.write_report(
                meta_data="2023 Annual Business Performance Analysis",
                data=datavis,
                business_type="Technology SaaS Company",
                num_sections=len(list(datavis))
            )

            print(result)
            print()
            print(visualisation[0])

            print(title, description)

            #logging.info("Report generation completed successfully.")
        except Exception as e:
            pass
            #logging.error(f"Error generating report: {e}")



        # datafile = DataFile()
        # datafile.store_file(user_email, file.filename, file)
#         clean_csv = preprocessing.adaptive_scaling(file)
#         extracted_data = data_profiler.generate_data_dictionary(clean_csv)
#
#         analysist = data_analysist.DataAnalyzerAgent()
#         analysis = analysist.analyse_data(
#                 header=extracted_data['header'],
#                 sample_row=extracted_data['sample_row'],
#                 metadata=extracted_data['metadata'],
#                 business_type="hotel"
#         )
#
#         visualisation = analysis['data_visualization']
#
#
#
# from ai.visualization_types import PieChartVisualization, LineGraphVisualization, BarChartVisualization, AreaChartVisualization
# import pandas as pd
# visualisation = analysis['data_visualization']
#
# datavis = []
# for v in visualisation:
#     if type(v) == LineGraphVisualization or BarChartVisualization or AreaChartVisualization:
#         revenue_dict = {
#             "Revenue Growth": {str(year): f"${revenue}M" for year, revenue in zip(df[v['x_axis']], df[v["y_axis"]])}
#         }
#         datavis.append(revenue_dict)
#     if type(v) == PieChartVisualization:
#
#        piedict = {}
#        for i in v['categories']:
#            piedict[i] = df[i]
#
#
#         reporter = data_reporter.DataReporter()
#            # Generate the report
#         result = reporter.write_report(
#             meta_data="2023 Annual Business Performance Analysis",
#             data=test_data,
#             business_type="Technology SaaS Company",
#             num_sections=len(test_data)
#         ) 
#

        return jsonify({"message": "file successfully added"})

    return jsonify({"error": "something went wrong"})


